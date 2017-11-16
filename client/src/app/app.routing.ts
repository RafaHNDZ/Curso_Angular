import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes del usuario
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artist/:page', component: ArtistListComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: 'add-artist',component: ArtistAddComponent},
    {path: '**', component: ArtistListComponent}
];

export const appRoutesProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
