<?php

declare(strict_types=1);

namespace App\Tests\Enum;

use App\Enum\PublicHoliday;
use App\Enum\PublicHoliday as PublicHolidayEnum;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class PublicHolidayTest extends TestCase
{
    public static function provideGetNameCases(): iterable
    {
        yield 'Neujahr' => [PublicHolidayEnum::NEW_YEAR, 2023, '2023-01-01'];
        yield 'Heilige Drei Könige' => [PublicHolidayEnum::EPIPHANY, 2023, '2023-01-06'];
        yield 'Frauentag' => [PublicHolidayEnum::WOMEN_DAY, 2023, '2023-03-08'];
        yield 'Karfreitag' => [PublicHolidayEnum::GOOD_FRIDAY, 2023, '2023-04-07'];
        yield 'Ostersonntag' => [PublicHolidayEnum::EASTER_SUNDAY, 2023, '2023-04-09'];
        yield 'Ostermontag' => [PublicHolidayEnum::EASTER_MONDAY, 2023, '2023-04-10'];
        yield 'Tag der Arbeit' => [PublicHolidayEnum::LABOR_DAY, 2023, '2023-05-01'];
        yield 'Christi Himmelfahrt' => [PublicHolidayEnum::ASCENSION_DAY, 2023, '2023-05-18'];
        yield 'Pfingstsonntag' => [PublicHolidayEnum::WHIT_SUNDAY, 2023, '2023-05-28'];
        yield 'Pfingstmontag' => [PublicHolidayEnum::WHIT_MONDAY, 2023, '2023-05-29'];
        yield 'Fronleichnam' => [PublicHolidayEnum::CORPUS_CHRISTI_DAY, 2023, '2023-06-08'];
        yield 'Mariä Himmelfahrt' => [PublicHolidayEnum::ASSUMPTION_DAY, 2023, '2023-08-15'];
        yield 'Weltkindertag' => [PublicHolidayEnum::CHILDREN_DAY, 2023, '2023-09-20'];
        yield 'Tag der Deutschen Einheit' => [PublicHolidayEnum::GERMAN_UNITY, 2023, '2023-10-03'];
        yield 'Reformationstag' => [PublicHolidayEnum::REFORMATION_DAY, 2023, '2023-10-31'];
        yield 'Allerheiligen' => [PublicHolidayEnum::ALL_SAINTS_DAY, 2023, '2023-11-01'];
        yield 'Buß- und Bettag' => [PublicHolidayEnum::REPENTANCE_DAY, 2023, '2023-11-22'];
        yield '1. Weihnachtsfeiertag' => [PublicHolidayEnum::CHRISTMAS_DAY, 2023, '2023-12-25'];
        yield '2. Weihnachtsfeiertag' => [PublicHolidayEnum::CHRISTMAS_2_DAY, 2023, '2023-12-26'];
    }

    /**
     * @dataProvider provideGetNameCases
     */
    public function testGetName(PublicHoliday $emum, int $y, string $expected): void
    {
        self::assertSame($expected, $emum->getDate($y)->format('Y-m-d'));
    }
}
