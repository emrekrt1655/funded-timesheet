<?php

declare(strict_types=1);

namespace App\Tests\Enum;

use App\Enum\PublicHoliday;
use App\Enum\Region;
use PHPUnit\Framework\TestCase;

/**
 * @internal
 *
 * @coversNothing
 */
final class RegionTest extends TestCase
{
    public static function provideGetPublicHolidaysCases(): iterable
    {
        yield 'BW' => [Region::BW, 2023, 12];
        yield 'BY' => [Region::BY, 2023, 13];
        yield 'BE' => [Region::BE, 2023, 10];
        yield 'BB' => [Region::BB, 2023, 12];
        yield 'HB' => [Region::HB, 2023, 10];
        yield 'HH' => [Region::HH, 2023, 10];
        yield 'HE' => [Region::HE, 2023, 12];
        yield 'MV' => [Region::MV, 2023, 11];
        yield 'NI' => [Region::NI, 2023, 10];
        yield 'NM' => [Region::NW, 2023, 11];
        yield 'RP' => [Region::RP, 2023, 11];
        yield 'SL' => [Region::SL, 2023, 12];
        yield 'SN' => [Region::SN, 2023, 11];
        yield 'ST' => [Region::ST, 2023, 11];
        yield 'SH' => [Region::SH, 2023, 10];
        yield 'TH' => [Region::TH, 2023, 11];
    }

    /**
     * @dataProvider provideGetPublicHolidaysCases
     */
    public function testGetPublicHolidays(Region $enum, int $y, int $expected): void
    {
        self::assertSame($expected, \count($enum->getPublicHolidays($y)));
    }

    public static function provideIsPublicHolidayCases(): iterable
    {
        yield 'Feiertag' => [Region::BY, new \DateTime('2023-01-01'), true];
        yield 'kein Feiertag' => [Region::BY, new \DateTime('2023-01-02'), false];
        yield 'kein Feiertag in Bayern' => [Region::BY, new \DateTime('2023-03-08'), false];
        yield 'Feiertag 2023' => [Region::MV, new \DateTime('2023-03-08'), true];
        yield 'kein Feiertag 2022' => [Region::MV, new \DateTime('2023-02-08'), false];
    }

    /**
     * @dataProvider provideIsPublicHolidayCases
     */
    public function testIsPublicHoliday(Region $enum, \DateTime $date, bool $expected): void
    {
        self::assertSame($expected, $enum->isPublicHoliday($date));
    }

    public static function provideGetPublicHolidayCases(): iterable
    {
        yield 'Feiertag' => [Region::BY, new \DateTime('2023-01-01'), PublicHoliday::NEW_YEAR];
        yield 'kein Feiertag' => [Region::BY, new \DateTime('2023-01-02'), null];
    }

    /**
     * @dataProvider provideGetPublicHolidayCases
     */
    public function testGetPublicHoliday(Region $enum, \DateTime $date, ?PublicHoliday $expected): void
    {
        self::assertSame($expected, $enum->getPublicHoliday($date));
    }
}
