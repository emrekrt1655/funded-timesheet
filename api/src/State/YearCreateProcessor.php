<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Day;
use App\Entity\Year;
use Doctrine\ORM\EntityManagerInterface;

final class YearCreateProcessor implements ProcessorInterface
{
    public function __construct(
        private readonly ProcessorInterface $decorated,
        private readonly EntityManagerInterface $em
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        $result = $this->decorated->process($data, $operation, $uriVariables, $context);

        if (!$result instanceof Year) {
            return $result;
        }

        if (!$operation instanceof Post) {
            return $result;
        }

        $yearInt = $result->getYear();
        $start   = (new \DateTimeImmutable(sprintf('%d-01-01', $yearInt)))->setTime(0, 0);
        $end     = (new \DateTimeImmutable(sprintf('%d-01-01', $yearInt + 1)))->setTime(0, 0);

        $count = (int) $this->em->createQueryBuilder()
            ->select('COUNT(d.id)')
            ->from(Day::class, 'd')
            ->where('d.year = :year')
            ->setParameter('year', $result)
            ->getQuery()
            ->getSingleScalarResult();

        if ($count > 0) {
            return $result;
        }

        $cursor = $start;
        while ($cursor < $end) {
            $day = new Day($result, $cursor);
            $this->em->persist($day);
            $result->addDay($day);
            $cursor = $cursor->modify('+1 day');
        }

        $this->em->flush();

        return $result;
    }
}
