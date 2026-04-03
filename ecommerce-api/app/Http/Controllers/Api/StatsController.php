<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use App\Models\Order;

class StatsController extends Controller
{
    public function index()
    {
        $totalProducts = Product::count();
        $totalUsers = User::where('is_admin', 0)->count();
        $totalCategories = Category::count();
        $totalOrders = Order::count();
        $totalRevenue = Order::where('status', 'completed')->sum('total');

        $lowStockProducts = Product::where('stock', '<', 5)->count();
        $latestOrders = Order::latest()->take(5)->get();

        return response()->json([
            'data' => [
                'total_products'   => $totalProducts,
                'total_users'      => $totalUsers,
                'total_categories' => $totalCategories,
                'total_orders'     => $totalOrders,
                'total_revenue'    => $totalRevenue,
                'low_stock'        => $lowStockProducts,
                'latest_orders'    => $latestOrders,
            ]
        ]);
    }
}
