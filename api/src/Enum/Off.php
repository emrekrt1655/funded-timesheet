<?php

declare(strict_types=1);

namespace App\Enum;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;

#[
    ApiResource(paginationEnabled: false, normalizationContext: ['groups' => ['read']]),
    Get(provider: self::class . '::getCase'),
    GetCollection(provider: self::class . '::getCases')
]
enum Off: string
{
    use EnumApiResourceTrait;

    case VACATION = 'Urlaub';
    case SICK = 'Krank';
}
