<?php

declare(strict_types=1);

namespace App\Enum;

use ApiPlatform\Metadata\Operation;
use Symfony\Component\Serializer\Annotation\Groups;

trait EnumApiResourceTrait
{
    public function getId(): string
    {
        return $this->name;
    }

    #[Groups(['read'])]
    public function getValue(): string
    {
        return $this->value;
    }

    /**
     * @return array<int, self>
     */
    public static function getCases(): array
    {
        return self::cases();
    }

    /**
     * @param array<string, string> $uriVariables
     *
     * @return self|null
     */
    public static function getCase(Operation $operation, array $uriVariables)
    {
        $name = $uriVariables['id'] ?? '';

        if (null !== self::tryFrom($name)) {
            return self::tryFrom($name);
        }

        if (\defined(self::class . "::{$name}")) {
            /** @var self */
            return \constant(self::class . "::{$name}");
        }

        return null;
    }

    public static function fromName(?string $name): ?self
    {
        foreach (self::cases() as $case) {
            if (strtolower($name ?? '') === strtolower($case->value)) {
                return $case;
            }
        }

        return null;
    }
}
