<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestsDuringMaintenance as Middleware;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PreventRequestsDuringMaintenance extends Middleware
{

    protected $except = [
        'api/status',
        'api/login',
        'api/register',
    ];

    public function handle(Request $request, Closure $next): Response
    {
        if ($this->app->isDownForMaintenance() && !in_array($request->path(), $this->except)) {

            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'Service unavailable: Maintenance mode',
                    'status'  => 503
                ], 503);
            }
        }

        return $next($request);
    }
}
