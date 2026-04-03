<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;

class CheckoutController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'street' => 'required|string',
            'city' => 'required|string',
            'zip' => 'nullable|string',
            'image' => 'required|image',
            'items' => 'required',
        ]);

        $cart = is_string($request->items)
            ? json_decode($request->items, true)
            : $request->items;

        if (! is_array($cart) || $cart === []) {
            return response()->json([
                'errors' => ['cart' => ['Invalid cart data']],
            ], 422);
        }

        if (! auth()->check()) {
            return response()->json([
                'message' => 'Unauthorized',
            ], 401);
        }

        $imagePath = null;

        try {
            $order = DB::transaction(function () use ($cart, $request, &$imagePath) {
                $total = 0;
                $imagePath = $request->file('image')->store('orders/receipts', 'public');

                $order = Order::create([
                    'user_id' => auth()->id(),
                    'name' => $request->name,
                    'email' => $request->email,
                    'phone' => $request->phone,
                    'address' => trim($request->street . ', ' . $request->city . ($request->zip ? ', ' . $request->zip : '')),
                    'total' => 0,
                    'status' => 'pending',
                    'payment' => 'COD',
                    'image' => $imagePath,
                ]);

                foreach ($cart as $item) {
                    if (! isset($item['id'], $item['quantity'])) {
                        throw ValidationException::withMessages([
                            'cart' => ['Invalid item format'],
                        ]);
                    }

                    $product = Product::lockForUpdate()->find($item['id']);

                    if (! $product) {
                        throw ValidationException::withMessages([
                            'cart' => ['Product not found'],
                        ]);
                    }

                    if ($product->stock < $item['quantity']) {
                        throw ValidationException::withMessages([
                            'cart' => ["{$product->name} out of stock"],
                        ]);
                    }

                    $itemTotal = $product->price * $item['quantity'];
                    $total += $itemTotal;

                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $product->id,
                        'quantity' => $item['quantity'],
                        'price' => $product->price,
                    ]);

                    $product->decrement('stock', $item['quantity']);
                }

                $order->update(['total' => $total]);

                return $order;
            });

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id,
                'total' => $order->total,
            ], 201);
        } catch (ValidationException $e) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            return response()->json([
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            if ($imagePath) {
                Storage::disk('public')->delete($imagePath);
            }

            return response()->json([
                'message' => 'Order failed',
                'error' => config('app.debug') ? $e->getMessage() : 'Server Error',
            ], 500);
        }
    }
}
