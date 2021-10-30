<?php
//передаваемые в сниппет параметры
//id - id ресурса с которого берем нужные поля
//tvInput - id полей для проверки, через запятую
//cols_count - количество выводимых колонок
//tpl - шаблон вывода
$id = $id;
$tvInput = explode(',', $tvs);
$cols_count = $cols;
$tpl = $tpl;

if (!isset($tvInput)) {
    return false;
} // Если не указаны TV, прекращаем выполнение кода
if (!isset($id)) {
    $id = $modx->resource->get('id');
} // По-умолчанию текущий ресурс
if (!isset($cols_count)) {
    $cols_count = 2;
} // Количество колонок по-умолчанию
if (!isset($tpl)) {
    $tpl = 'objectParams';
} // Шаблон по-умолчанию

$criteria = $modx->newQuery('modTemplateVarResource', [
    'contentid' => $id,
    'tmplvarid:IN' => $tvInput,
    'value:!=' => ''
]);
$criteria->sortby('tmplvarid');
$docs = $modx->getCollection('modTemplateVarResource', $criteria);

//выводим по колонкам
//default_elems_at_col - количество элементов в колонке
$output = '';
$count = count($docs);
$default_elems_at_col = floor($count / $cols_count);
$continue_default = false;

/* 
  как работает:
  например: 52 элемента на 5 колонок
  $default_elems_at_col - количество элементов в колонке по умолчанию floor(52 / 5) = 10
  остается 2 элемента (52 - 50), которые необходимо распределить по колонкам, т.е.
  $real_default_elems_at_col = 11 (для первых двух колонок)
  $continue_default - переменная, чтобы прекратить лишние вычисления на итерациях, когда лишних элементов не осталось
*/
$output .= '<div class="params params_cols-' . $cols_count . '">';
for ($i = 0; $i < $cols_count; $i++) {
    if (!$continue_default) {
        $real_default_elems_at_col = $default_elems_at_col + 1;
        if (($real_default_elems_at_col * ($i + 1) + ($cols_count - $i - 1) * $default_elems_at_col) > $count) {
            $real_default_elems_at_col = $default_elems_at_col;
            $continue_default = true;
        }
    }

    $output .= '<div class="params__column">';
    for ($j = 0; $j < $real_default_elems_at_col; $j++) {
        $current_doc = current($docs)->toArray();
        $tvId = $current_doc["tmplvarid"];
        $value = $current_doc["value"];

        $output .= $modx->getChunk($tpl, [
            'tvId' => $tvId,
            'value' => $value
        ]);

        //если следующего элемента нет - выходим из цикла
        if (!next($docs)) {
            break;
        }
    }
    $output .= '</div>';
}
$output .= '</div>';
return $output;
