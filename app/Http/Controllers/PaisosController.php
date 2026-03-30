<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Country;

class PaisosController extends Controller
{
    function llistarPaisos()
    {
        $paisos = Country::orderBy("name")->get(["code", "name"]);
        return $paisos;
    }
}
