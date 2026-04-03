<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{

    public function store(Request $request)
    {

        $items = is_string($request->items)
            ? json_decode($request->items, true)
            : $request->items;

        if (!is_array($items)) {
            return response()->json([
                'message' => 'Invalid cart data'
            ], 422);
        }

        $validated = $request->validate([
            'name'   => 'required|string|max:255',
            'email'  => 'required|email',
            'phone'  => 'required|string',
            'street' => 'required|string',
            'city'   => 'required|string',
            'zip'    => 'nullable|string',
            'image'  => 'required|image',
        ]);

        DB::beginTransaction();

        try {

            $path = $request->file('image')->store('orders/receipts', 'public');

            $order = Order::create([
                'user_id' => auth()->id(),
                'name'    => $validated['name'],
                'email'   => $validated['email'],
                'phone'   => $validated['phone'],
                'address' => trim("{$validated['street']}, {$validated['city']}" . ($validated['zip'] ? ", {$validated['zip']}" : "")),
                'image'   => $path,
                'total'   => 0,
                'status'  => 'pending',
                'payment' => 'COD',
            ]);

            $total = 0;

            foreach ($items as $item) {

                if (!isset($item['id'], $item['quantity'])) {
                    throw ValidationException::withMessages([
                        'items' => ['Invalid item structure']
                    ]);
                }

                $product = Product::lockForUpdate()->find($item['id']);

                if (!$product) {
                    throw ValidationException::withMessages([
                        'items' => ['Product not found']
                    ]);
                }

                if ($product->stock < $item['quantity']) {
                    throw ValidationException::withMessages([
                        'items' => ["{$product->name} is out of stock"]
                    ]);
                }

                $itemTotal = $product->price * $item['quantity'];
                $total += $itemTotal;

                OrderItem::create([
                    'order_id'   => $order->id,
                    'product_id' => $product->id,
                    'quantity'   => $item['quantity'],
                    'price'      => $product->price,
                ]);

                $product->decrement('stock', $item['quantity']);
            }

            $order->update(['total' => $total]);

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'data' => [
                    'order_id' => $order->id,
                    'total'    => $total
                ]
            ], 201);
        } catch (ValidationException $e) {

            DB::rollBack();
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            return response()->json([
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {

            DB::rollBack();
            if (isset($path)) {
                Storage::disk('public')->delete($path);
            }

            Log::error("Order Error: " . $e->getMessage());

            return response()->json([
                'message' => 'Order failed',
                'error'   => config('app.debug') ? $e->getMessage() : 'Server Error'
            ], 500);
        }
    }

    public function index()
    {
        $orders = Order::with('items.product')
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

        return response()->json([
            'data' => $orders
        ]);
    }
}
