<?php
$ids = explode(",", $modx->getOption('input', $scriptProperties));

$context = $modx->getOption('context', $scriptProperties, $modx->context->key);
$toPlaceholder = $modx->getOption('toPlaceholder', $scriptProperties, true);


if (count($ids) == 1 && $modx->resource == $ids[0]) {
    //если ресурс тот же что нам надо, то завершаем скрипт
    $properties = $modx->resource->getProperties("babel");
    if (isset($toPlaceholder)) {
        $modx->setPlaceholder("id_$ids[0]", $properties['aliases'][$ids[0]]);

    } else {
        return $properties;
    }

    return;
} else {

    $pages = $modx->getCollection("modResource", array(
        "id:IN" => $ids
    ));
    $result = array();
    foreach ($pages as $page) {

        $properties = $page->getProperties("babel");

        if ($toPlaceholder) {
            $id = $page->get("id");
            $result["id_$id"] = $properties['aliases'][$context];

        } else {
            $result[] = $properties['aliases'][$context];
        }
    }
    if ($toPlaceholder) {
        $modx->setPlaceholders($result);

        return;
    } else {

        return implode(",", $result);
    }

}
