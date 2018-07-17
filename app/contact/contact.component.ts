import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import * as app from "application";
import { RadSideDrawer } from 'nativescript-telerik-ui/sidedrawer';
import { TNSFontIconService } from 'nativescript-ngx-fonticon';
import * as Email from 'nativescript-email';

@Component({
    selector: 'app-contact',
    moduleId: module.id,
    templateUrl: './contact.component.html'
})
export class ContactComponent extends DrawerPage implements OnInit {

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private fonticon: TNSFontIconService) {
        super(changeDetectorRef);
    }

    ngOnInit() {

    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }

    sendEmail() {
        Email.available()
            .then((avail: boolean) => {
                if (avail) {
                    Email.compose({
                        to: ['confusion@food.net'],
                        subject: '[ConFusion]: Query',
                        body: 'Dear Sir/Madam:'
                    });
                }
                else
                    console.log('No Email Configured');
            })
    }
}