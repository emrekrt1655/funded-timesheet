<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\HttpOperation;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ApiResource\Error;
use ApiPlatform\State\ProviderInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * @implements ProviderInterface<Error>
 */
final class ErrorProvider implements ProviderInterface
{
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object
    {
        $request = $context['request'];
        if (!$request instanceof Request) {
            throw new \RuntimeException();
        }

        $exception = $request->attributes->get('exception');
        if (!$exception instanceof \Throwable) {
            throw new \RuntimeException();
        }

        /** @var HttpOperation $operation */
        $status = $operation->getStatus() ?? 500;

        $error = Error::createFromException($exception, $status);

        if ($status >= 500) {
            $error->setDetail('internal_server_error');

            return $error;
        }

        switch ($status) {
            case Response::HTTP_UNAUTHORIZED:
                $error->setDetail('unauthorized');
                break;
            case Response::HTTP_FORBIDDEN:
                $error->setDetail('forbidden');
                break;
            case Response::HTTP_NOT_FOUND:
                $error->setDetail('not_found');
                break;
            case Response::HTTP_UNPROCESSABLE_ENTITY:
                $error->setDetail('unprocessable_entity');
                break;
            default:
                $error->setDetail('bad_request');
        }

        return $error;
    }
}
