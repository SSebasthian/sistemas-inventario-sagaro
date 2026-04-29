import { Routes } from '@angular/router';
import { AccesoComponent } from './pagina/autenticacion/acceso/acceso.component';
import { PerfilComponent } from './pagina/autenticacion/perfil/perfil.component';
import { estadoPrivado, estadoPublico } from './arquitectura/guardianRuta/enturamiento.guard';



export const routes: Routes = [
    {
        path: '',
        component: AccesoComponent,
        canActivate: [estadoPublico]
    },
    {
        path: 'autenticacion',
        children: [
            {
                path: 'acceso',
                component: AccesoComponent,
                canActivate: [estadoPublico]
            },
            {
                path: 'perfil',
                component: PerfilComponent,
                canActivate: [estadoPrivado]
            }
        ]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
