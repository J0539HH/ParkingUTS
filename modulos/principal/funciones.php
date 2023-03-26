<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

function custom_get_called_class() {
    $objects = array();
    $traces = debug_backtrace();
    foreach ($traces as $trace) {
        if (isset($trace['object'])) {
            if (is_object($trace['object'])) {
                $objects[] = $trace['object'];
            }
        }
    }
    if (count($objects)) {
        return get_class($objects[0]);
    }
}


function GenerarCadenaAleatoria($NumLetras) {
    $alfabeto = "mnbvcxz1LKJHG3FDS9Apoiuytrewq5VCXZ0QWERT4gfdsa7BNM2hjkl6YUIO8P";

    mt_srand((double) microtime() * 1000000);
    $cadena = substr($alfabeto, mt_rand(0, 61), 1);
    for ($i = 0; $i < $NumLetras - 1; $i++) {
        $cadena.=substr($alfabeto, mt_rand(0, 61), 1);
    }
    return $cadena;
}
