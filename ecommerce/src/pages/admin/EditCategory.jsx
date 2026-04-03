import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Loader2, Save } from 'lucide-react';
import api from '../../api/axios';
import { normalizeCollection } from '../../utils/api';

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const { data } = await api.get('/categories');
        const categories = normalizeCollection(data);
        const category = categories.find((item) => String(item.id) === String(id));

        if (!category) {
          throw new Error('Category not found');
        }

        setName(category.name);
      } catch {
        toast.error('Category not found');
        navigate('/admin/categories', { replace: true });
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsUpdating(true);

    try {
      await api.put(`/categories/${id}`, { name });
      toast.success('Category updated successfully!');
      navigate('/admin/categories', { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Update failed');
      console.error(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>);

  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <button
          type="button"
          onClick={() => navigate('/admin/categories')}
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors font-bold">

          <ArrowLeft size={20} /> Back to List
        </button>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Edit Category</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-black text-slate-700 uppercase tracking-wider">
              Category Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none font-bold text-slate-800"
              placeholder="e.g. Premium Watches" />

          </div>

          <p className="text-sm text-slate-500">
            This editor only updates the category name because the current Laravel category API accepts `name` only.
          </p>

          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-slate-900 hover:bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 transition-all shadow-xl disabled:opacity-50">

            {isUpdating ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
            {isUpdating ? 'Updating...' : 'Update Category'}
          </button>
        </div>
      </form>
    </div>);

}
