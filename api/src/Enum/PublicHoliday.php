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
enum PublicHoliday: string
{
    use EnumApiResourceTrait;

    case NEW_YEAR = 'Neujahr';
    case EPIPHANY = 'Heilige Drei Könige';
    case WOMEN_DAY = 'Frauentag';
    case GOOD_FRIDAY = 'Karfreitag';
    case EASTER_SUNDAY = 'Ostersonntag';
    case EASTER_MONDAY = 'Ostermontag';
    case LABOR_DAY = 'Tag der Arbeit';
    case ASCENSION_DAY = 'Christi Himmelfahrt';
    case WHIT_SUNDAY = 'Pfingstsonntag';
    case WHIT_MONDAY = 'Pfingstmontag';
    case CORPUS_CHRISTI_DAY = 'Fronleichnam';
    case AUGSBURG_PEACE_FESTIVAL = 'Augsburger Friedensfest';
    case ASSUMPTION_DAY = 'Mariä Himmelfahrt';
    case CHILDREN_DAY = 'Weltkindertag';
    case GERMAN_UNITY = 'Tag der Deutschen Einheit';
    case REFORMATION_DAY = 'Reformationstag';
    case ALL_SAINTS_DAY = 'Allerheiligen';
    case REPENTANCE_DAY = 'Buß- und Bettag';
    case CHRISTMAS_DAY = '1. Weihnachtsfeiertag';
    case CHRISTMAS_2_DAY = '2. Weihnachtsfeiertag';

    public function getDate(int $y): \DateTimeImmutable
    {
        $days = easter_days($y);
        $easter = (new \DateTimeImmutable("{$y}-03-21"))->modify("+{$days} days");

        return match ($this) {
            self::NEW_YEAR => new \DateTimeImmutable("{$y}-01-01"),
            self::EPIPHANY => new \DateTimeImmutable("{$y}-01-06"),
            self::WOMEN_DAY => new \DateTimeImmutable("{$y}-03-08"),
            self::GOOD_FRIDAY => $easter->modify('-2 days'),
            self::EASTER_SUNDAY => $easter->modify('+0 days'),
            self::EASTER_MONDAY => $easter->modify('+1 days'),
            self::LABOR_DAY => new \DateTimeImmutable("{$y}-05-01"),
            self::ASCENSION_DAY => $easter->modify('+39 days'),
            self::WHIT_SUNDAY => $easter->modify('+49 days'),
            self::WHIT_MONDAY => $easter->modify('+50 days'),
            self::CORPUS_CHRISTI_DAY => $easter->modify('+60 days'),
            self::AUGSBURG_PEACE_FESTIVAL => new \DateTimeImmutable("{$y}-08-08"),
            self::ASSUMPTION_DAY => new \DateTimeImmutable("{$y}-08-15"),
            self::CHILDREN_DAY => new \DateTimeImmutable("{$y}-09-20"),
            self::GERMAN_UNITY => new \DateTimeImmutable("{$y}-10-03"),
            self::REFORMATION_DAY => new \DateTimeImmutable("{$y}-10-31"),
            self::ALL_SAINTS_DAY => new \DateTimeImmutable("{$y}-11-01"),
            self::REPENTANCE_DAY => (new \DateTimeImmutable("{$y}-11-23"))->modify('last Wednesday'),
            self::CHRISTMAS_DAY => new \DateTimeImmutable("{$y}-12-25"),
            self::CHRISTMAS_2_DAY => new \DateTimeImmutable("{$y}-12-26"),
        };
    }
}
