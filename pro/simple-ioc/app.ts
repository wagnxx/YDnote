import {container} from './inversify.config';
import {Classroom} from './interfaces';
import TYPES from './types';

const classroom = container.get<Classroom>(TYPES.Classroom);

console.log(classroom.study());
