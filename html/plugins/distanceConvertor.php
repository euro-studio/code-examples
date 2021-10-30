<?php
if (strpos($input, 'd') !== false) {
  $output = str_replace('d', '', $input);
  return $output;
} else if (strpos($input, 'm') !== false) {
  $replace = str_replace('m', '', $input);
  $output = ceil(abs($input * 60 / 60000));
  return $output;
} else {
  $replace = str_replace('w', '', $input);
  $output = ceil(abs($input * 5000 / 60000));
  return $output;
}
