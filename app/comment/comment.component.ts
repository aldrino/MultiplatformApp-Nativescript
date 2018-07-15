import { Component, OnInit } from '@angular/core';
import { ModalDialogParams } from 'nativescript-angular/modal-dialog';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Comment } from '~/shared/comment';
import { Slider } from "ui/slider";

@Component({
    moduleId: module.id,
    templateUrl: './comment.component.html'
})
export class CommentComponent implements OnInit {

    commentForm: FormGroup;

    constructor(private params: ModalDialogParams,
        private formBuilder: FormBuilder) {
            this.commentForm = this.formBuilder.group({
                author: ['', Validators.required],
                rating: 5,
                comment: ['', Validators.required]
            });
    }

    ngOnInit() {

    }

    public onSubmit() {
        let comment: Comment = {
            author: this.commentForm.value.author,
            rating: this.commentForm.value.rating,
            comment: this.commentForm.value.comment,
            date: new Date().toISOString()
        }
        this.params.closeCallback(comment);
    }
}