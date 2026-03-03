import type { NextApiRequest, NextApiResponse } from 'next';
import { PersonUpdate } from '@namiuy/bff-core';
import { createRepositories } from './_config';
import { createGetPersonUseCase, createUpdatePersonUseCase } from '../../usecases/person';
import { requireAuth, sendResult, methodNotAllowed } from './_helpers';

export default requireAuth(async (req: NextApiRequest, res: NextApiResponse, token: string) => {
  // Get repositories with auth
  const { personRepository } = createRepositories(() => token);

  switch (req.method) {
    case 'GET': {
      // Get person by ID
      const { id } = req.query;
      if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Person ID is required' });
      }

      const getPerson = createGetPersonUseCase(personRepository);
      const result = await getPerson(id);
      return sendResult(res, result);
    }

    case 'PUT': {
      // Update person
      const personData: PersonUpdate = req.body;
      const updatePerson = createUpdatePersonUseCase(personRepository);
      const result = await updatePerson(personData);
      return sendResult(res, result);
    }

    default:
      return methodNotAllowed(res, ['GET', 'PUT']);
  }
});
