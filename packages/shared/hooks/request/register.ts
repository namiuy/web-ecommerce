import { useEffect, useState } from 'react';
import { bff } from '../../env';
import { Response } from './response';
import { get, post } from '../../utils/fetcher';
import { User } from '../../entities/user';

type RegisterProps = {
    name: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
    address: string;
    department: string;
    location: string;
};
    
const UNAUTHORIZED_MESSAGE = 'El correo electrónico ya se encuentra registrado.';
const UNEXPECTED_ERROR_MESSAGE = 'Ha ocurrido un error inesperado, por favor vuelve a intentarlo mas tarde.';

