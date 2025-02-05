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
enum Region: string
{
    use EnumApiResourceTrait;

    case BW = 'Baden-Württemberg';
    case BY = 'Bayern';
    case BY_AUGSBURG = 'Bayern (Augsburg)';
    case BE = 'Berlin';
    case BB = 'Brandenburg';
    case HB = 'Bremen';
    case HH = 'Hamburg';
    case HE = 'Hessen';
    case NI = 'Niedersachsen';
    case MV = 'Mecklenburg-Vorpommern';
    case NW = 'Nordrhein-Westfalen';
    case RP = 'Rheinland-Pfalz';
    case SL = 'Saarland';
    case SN = 'Sachsen';
    case ST = 'Sachsen-Anhalt';
    case SH = 'Schleswig-Holstein';
    case TH = 'Thüringen';

    public function isPublicHoliday(\DateTimeInterface $date): bool
    {
        $year = (int) $date->format('Y');

        return \array_key_exists($date->format('Y-m-d'), $this->getDates($year));
    }

    public function getPublicHoliday(\DateTimeInterface $date): ?PublicHoliday
    {
        $year = (int) $date->format('Y');

        return $this->getDates($year)[$date->format('Y-m-d')] ?? null;
    }

    /**
     * @return array<PublicHoliday>
     */
    public function getPublicHolidays(int $y): array
    {
        $general = [
            PublicHoliday::NEW_YEAR,
            PublicHoliday::GOOD_FRIDAY,
            PublicHoliday::EASTER_MONDAY,
            PublicHoliday::LABOR_DAY,
            PublicHoliday::ASCENSION_DAY,
            PublicHoliday::WHIT_MONDAY,
            PublicHoliday::GERMAN_UNITY,
            PublicHoliday::CHRISTMAS_DAY,
            PublicHoliday::CHRISTMAS_2_DAY,
        ];

        $specific = match ($this) {
            self::BW => [
                PublicHoliday::EPIPHANY,
                PublicHoliday::CORPUS_CHRISTI_DAY,
                PublicHoliday::ALL_SAINTS_DAY,
            ],
            self::BY => [
                PublicHoliday::EPIPHANY,
                PublicHoliday::CORPUS_CHRISTI_DAY,
                PublicHoliday::ASSUMPTION_DAY,
                PublicHoliday::ALL_SAINTS_DAY,
            ],
            self::BY_AUGSBURG => [
                PublicHoliday::EPIPHANY,
                PublicHoliday::CORPUS_CHRISTI_DAY,
                PublicHoliday::AUGSBURG_PEACE_FESTIVAL,
                PublicHoliday::ASSUMPTION_DAY,
                PublicHoliday::ALL_SAINTS_DAY,
            ],
            self::BE => [
                $y >= 2019 ? PublicHoliday::WOMEN_DAY : null,
            ],
            self::BB => [
                PublicHoliday::EASTER_SUNDAY,
                PublicHoliday::WHIT_SUNDAY,
                PublicHoliday::REFORMATION_DAY,
            ],
            self::HB, self::HH, self::SH, self::NI => [
                $y >= 2017 ? PublicHoliday::REFORMATION_DAY : null,
            ],
            self::HE => [
                PublicHoliday::EASTER_SUNDAY,
                PublicHoliday::WHIT_SUNDAY,
                PublicHoliday::CORPUS_CHRISTI_DAY,
            ],
            self::MV => [
                $y >= 2023 ? PublicHoliday::WOMEN_DAY : null,
                PublicHoliday::REFORMATION_DAY,
            ],
            self::NW, self::RP => [
                PublicHoliday::CORPUS_CHRISTI_DAY,
                PublicHoliday::ALL_SAINTS_DAY,
            ],
            self::SL => [
                PublicHoliday::CORPUS_CHRISTI_DAY,
                PublicHoliday::ASSUMPTION_DAY,
                PublicHoliday::ALL_SAINTS_DAY,
            ],
            self::SN => [
                PublicHoliday::REFORMATION_DAY,
                PublicHoliday::REPENTANCE_DAY,
            ],
            self::ST => [
                PublicHoliday::EPIPHANY,
                PublicHoliday::REFORMATION_DAY,
            ],
            self::TH => [
                $y >= 2019 ? PublicHoliday::CHILDREN_DAY : null,
                PublicHoliday::REFORMATION_DAY,
            ],
        };

        return array_filter(array_merge($general, $specific));
    }

    /**
     * @return array<string, PublicHoliday>
     */
    private function getDates(int $y): array
    {
        $dates = [];

        foreach ($this->getPublicHolidays($y) as $publicHoliday) {
            $dates[$publicHoliday->getDate($y)->format('Y-m-d')] = $publicHoliday;
        }

        return $dates;
    }
}
