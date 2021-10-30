<?php
/* Склонение слов */ 
/** @var array $scriptProperties */
$number = $modx->getOption('input', $scriptProperties, 0);
$forms = $modx->getOption('options', $scriptProperties, '');
if (is_string($forms)) {
    if ($forms[0] == '[') {
        $forms = $modx->fromJSON($forms);
    } else {
        $forms = explode(',', $forms);
    }
}
if (!is_numeric($number)) {
    return;
}
if (!is_array($forms) || empty($forms)) {
    return 'Вы должны указать формы слов для склонения. Например [[*id:declension=`яблоко,яблока,яблок`]].';
}

if (count($forms) == 3) {
    $mod100 = $number % 100;
    switch ($number % 10) {
        case 1:
            if ($mod100 == 11) {
                $text = $forms[2];
            } else {
                $text = $forms[0];
            }
            break;
        case 2:
        case 3:
        case 4:
            if (($mod100 > 10) && ($mod100 < 20)) {
                $text = $forms[2];
            } else {
                $text = $forms[1];
            }
            break;
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 0:
        default:
            $text = $forms[2];
    }
} elseif (count($forms) == 2) {
    if ($number == 1) {
        $text = $forms[0];
    } else {
        $text = $forms[1];
    }
} else {
    $text = 'Недостаточно форм слов для склонения';
}

return $text;
