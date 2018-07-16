import { Component, OnInit, ChangeDetectorRef, ViewContainerRef } from '@angular/core';
import { DrawerPage } from '../shared/drawer/drawer.page';
import { TextField } from 'ui/text-field';
import { Switch } from 'ui/switch';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ModalDialogService, ModalDialogOptions } from "nativescript-angular/modal-dialog";
import { ReservationModalComponent } from "../reservationmodal/reservationmodal.component";
import * as app from "application";
import { RadSideDrawer } from 'nativescript-telerik-ui/sidedrawer';
import { CouchbaseService } from '../services/couchbase.service';
import { Animation, AnimationDefinition } from 'tns-core-modules/ui/animation/animation';
import * as enums from "ui/enums";
import { View } from "ui/core/view";
import { Page } from "ui/page";

@Component({
    selector: 'app-reservation',
    moduleId: module.id,
    templateUrl: './reservation.component.html'
})
export class ReservationComponent extends DrawerPage implements OnInit {

    reservation: FormGroup;
    reservations: Array<Object>;
    docId: string = "reservations";
    reservationSubmit: boolean;
    formLayout: View;
    formDisp: View;

    constructor(private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private modalService: ModalDialogService,
        private vcRef: ViewContainerRef,
        private couchbaseService: CouchbaseService,
        private page: Page) {
        super(changeDetectorRef);

        this.reservation = this.formBuilder.group({
            guests: 3,
            smoking: false,
            dateTime: ['', Validators.required]
        });

        this.reservations = [];
        let doc = this.couchbaseService.getDocument(this.docId);
        if (doc == null) {
            this.couchbaseService.createDocument({ "reservations": [] }, this.docId);
        }
        else {
            this.reservations = doc.reservations;
        }
        console.log(this.reservations);
    }

    ngOnInit() {

    }

    onSmokingChecked(args) {
        let smokingSwitch = <Switch>args.object;
        if (smokingSwitch.checked) {
            this.reservation.patchValue({ smoking: true });
        }
        else {
            this.reservation.patchValue({ smoking: false });
        }
    }

    onGuestChange(args) {
        let textField = <TextField>args.object;
        this.reservation.patchValue({ guests: textField.text });
    }

    onDateTimeChange(args) {
        let textField = <TextField>args.object;
        this.reservation.patchValue({ dateTime: textField.text });
    }

    onSubmit() {
        // Animations
        this.formLayout = <View>this.page.getViewById<View>("formLayout");
        this.formDisp = <View>this.page.getViewById<View>("formDisp");
        this.formLayout.animate({
            scale: { x: 0, y: 0 },
            opacity: 0,
            duration: 500,
            curve: enums.AnimationCurve.easeOut
        }).then(() => {
            this.reservations.push(this.reservation.value);
            // Update Couchbase lite
            this.couchbaseService.updateDocument(this.docId, { "reservations": this.reservations });    
            this.formDisp.animate({
                scale: { x: 1, y: 1 },
                opacity: 1,
                duration: 500,
                curve: enums.AnimationCurve.easeIn
            }).then(() => {
                this.reservationSubmit = true;
            })
        })
    }

    createModalView(args) {

        let options: ModalDialogOptions = {
            viewContainerRef: this.vcRef,
            context: args,
            fullscreen: false
        };

        this.modalService.showModal(ReservationModalComponent, options)
            .then((result: any) => {
                if (args === "guest") {
                    this.reservation.patchValue({ guests: result });
                }
                else if (args === "date-time") {
                    this.reservation.patchValue({ dateTime: result });
                }
            });
    }

    onDrawerButtonTap(): void {
        const sideDrawer = <RadSideDrawer>app.getRootView();
        sideDrawer.showDrawer();
    }
}