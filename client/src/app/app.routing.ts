import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes del usuario
import { UserEditComponent } from './components/user-edit.component';

const appRoutes: Routes = [
    {path: '', component: UserEditComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: '**', component: UserEditComponent}
];

export const appRoutesProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);