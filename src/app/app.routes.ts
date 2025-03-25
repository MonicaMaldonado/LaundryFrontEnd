import { Routes } from '@angular/router';
import { ClientListComponent } from './features/clients/client-list/client-list.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/auth.guard';
import { ServicesComponent } from './features/services/services.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PromotionComponent } from './features/promotion/promotion.component';
import { roleGuard } from './core/role.guard';
import { OrderListComponent } from './features/orders/order-list/order-list.component';
import { OrderFormComponent } from './features/orders/order-form/order-form.component';
import { OrderItemComponent } from './features/orders/order-item/order-item.component';

export const routes: Routes = [
    {path:'clients', 
        component: ClientListComponent, 
        canActivate: [authGuard]},
    {path: '', component: ServicesComponent},
    {path:'login', component: LoginComponent},
    {path:'dashboard', component: DashboardComponent},
    {path:'promotion/new', 
        component: PromotionComponent,
        canActivate: [authGuard, roleGuard],
        data: {role: 'Administrador'}},
    {path:'order', component: OrderListComponent, canActivate: [authGuard]},
    {path:'order/item', component: OrderItemComponent},
    {path:'order/new', component: OrderFormComponent,
   //      canActivate: [authGuard]
        }
];
