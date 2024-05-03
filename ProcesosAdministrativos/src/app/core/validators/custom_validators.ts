import { AbstractControl, FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators{
    static fechaFinalMenorQueInicial(control: AbstractControl): ValidationErrors | null {
        const fechaInicio = control.get('fechaInicio')?.value;
        const fechaFin = control.get('fechaFin')?.value;
        if (fechaInicio && fechaFin && new Date(fechaInicio) > new Date(fechaFin)) {
            return { fechaInvalida: true };
        }
    
        return null;
    }
}