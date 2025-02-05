<?php

declare(strict_types=1);

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enum\Region;
use App\Repository\YearRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['read']],
)]
#[ORM\Entity(repositoryClass: YearRepository::class)]
class Year
{
    use IdTrait;

    #[Assert\GreaterThanOrEqual(2020)]
    #[Assert\LessThanOrEqual(2030)]
    #[Assert\NotNull]
    #[Groups(['read'])]
    #[ORM\Column]
    private int $year;

    #[Assert\NotNull]
    #[Groups(['read'])]
    #[ORM\Column(nullable: true)]
    private ?Region $region = null;

    /** @var Collection<int, Day> */
    #[Groups(['read'])]
    #[ORM\OneToMany(mappedBy: 'year', targetEntity: Day::class, cascade: ['persist'], orphanRemoval: true)]
    #[ORM\OrderBy(['date' => 'ASC'])]
    private Collection $days;

    public function __construct(int $year)
    {
        $this->year = $year;

        $this->days = new ArrayCollection();
    }

    public function getYear(): int
    {
        return $this->year;
    }

    public function getRegion(): Region
    {
        if (null === $this->region) {
            throw new \RuntimeException('Region is not set');
        }

        return $this->region;
    }

    public function setRegion(Region $region): static
    {
        $this->region = $region;

        return $this;
    }

    /**
     * @return Collection<int, Day>
     */
    public function getDays(): Collection
    {
        return $this->days;
    }

    public function addDay(Day $day): static
    {
        if (!$this->days->contains($day)) {
            $this->days->add($day);
        }

        return $this;
    }

    public function getDay(\DateTimeInterface $date): ?Day
    {
        foreach ($this->days as $day) {
            if ($day->getDate()->format('Ymd') === $date->format('Ymd')) {
                return $day;
            }
        }

        return null;
    }
}
