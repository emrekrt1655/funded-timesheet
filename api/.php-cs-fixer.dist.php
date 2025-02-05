<?php

$finder = (new PhpCsFixer\Finder())
    ->in(__DIR__)
    ->exclude('var')
;

return (new PhpCsFixer\Config())
    ->setRiskyAllowed(true)
    ->setRules([
        '@PhpCsFixer' => true,
        '@PhpCsFixer:risky' => true,
        '@Symfony' => true,
        '@Symfony:risky' => true,
        'concat_space' => ['spacing' => 'one'],
        'declare_strict_types' => true,
        'nullable_type_declaration' => true,
        'ordered_attributes' => true,
        'phpdoc_to_comment' => false,
        'void_return' => true,
        'yoda_style' => false,
    ])
    ->setFinder($finder)
    ;
