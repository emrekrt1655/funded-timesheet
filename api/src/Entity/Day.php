<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Put;
use App\Enum\Off;
use App\Enum\PublicHoliday;
use App\Repository\DayRepository;
use App\State\DayPersistProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new Put(),
    ],
)]
#[ORM\Entity(repositoryClass: DayRepository::class)]
class Day
{
    use IdTrait;

    #[ORM\JoinColumn(nullable: false, onDelete: 'CASCADE')]
    #[ORM\ManyToOne(inversedBy: 'days')]
    private Year $year;

    #[Groups(['read'])]
    #[ORM\Column(type: Types::DATE_IMMUTABLE)]
    private \DateTimeImmutable $date;

    #[Groups(['read'])]
    #[ORM\Column(nullable: true, enumType: PublicHoliday::class)]
    private ?PublicHoliday $publicHoliday = null;

    #[Groups(['read'])]
    #[ORM\Column(nullable: true)]
    private ?int $hours = null;

    #[Groups(['read'])]
    #[ORM\Column(nullable: true, enumType: Off::class)]
    private ?Off $off = null;

    public ?\DateTimeImmutable $finish = null;

    public function __construct(Year $year, \DateTimeImmutable $date)
    {
        $this->year = $year;
        $this->date = $date;
    }

    public function getYear(): Year
    {
        return $this->year;
    }

    public function getDate(): \DateTimeImmutable
    {
        return $this->date;
    }

    public function getPublicHoliday(): ?PublicHoliday
    {
        return $this->publicHoliday;
    }

    public function setPublicHoliday(?PublicHoliday $publicHoliday): static
    {
        $this->publicHoliday = $publicHoliday;

        return $this;
    }

    public function getHours(): ?int
    {
        return $this->hours;
    }

    public function setHours(?int $hours): static
    {
        $this->hours = $hours;

        if (null !== $hours) {
            $this->off = null;
        }

        return $this;
    }

    public function getOff(): ?Off
    {
        return $this->off;
    }

    public function setOff(?Off $off): static
    {
        $this->off = $off;

        if (null !== $off) {
            $this->hours = null;
        }

        return $this;
    }

    public function getFinish(): \DateTimeImmutable
    {
        return $this->finish ?? $this->date;
    }
}
