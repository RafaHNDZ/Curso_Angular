import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Importar componentes del usuario
import { UserEditComponent } from './components/user-edit.component';
import { ArtistListComponent } from './components/artist-list.component';
import { HomeComponent } from './components/home.component';
import { ArtistAddComponent } from './components/artist-add.component';
import { ArtistEditComponent } from './components/artist-edit.component';
import { ArtistDetailComponent } from './components/artist-detail.component';
import { AlbumEditComponent } from './components/album-edit.component';

//Import AlbumAddComponent
import {AlbumAddComponent} from './components/album-add.component';

const appRoutes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'artists/:page', component: ArtistListComponent},
    {path: 'mis-datos', component: UserEditComponent},
    {path: 'add-artist',component: ArtistAddComponent},
    {path: 'artist/:id', component: ArtistDetailComponent},
    {path: 'edit-artist/:id', component: ArtistEditComponent},
    {path: 'add-album/:artist', component: AlbumAddComponent},
    {path: 'edit-album/:id', component: AlbumEditComponent},
    {path: '**', component: ArtistListComponent}
];

export const appRoutesProviders: any[] = [];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
