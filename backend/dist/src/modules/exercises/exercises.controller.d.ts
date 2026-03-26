import { ExercisesService } from './exercises.service';
export declare class ExercisesController {
    private readonly exercisesService;
    constructor(exercisesService: ExercisesService);
    list(): {
        message: string;
    };
}
