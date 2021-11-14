import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, first } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    user: Observable<any>;

    constructor(
        private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router
    ) {
    }
    currentUser(){
        return this.user;
    }
    subscribeUser() {
        if (this.user == null) {
            this.afAuth.authState.pipe(first())
                .subscribe(user => {
                    this.user = this.afs.collection('admins').doc(user.uid).valueChanges();
                });
        }
    }

    async login(email: string, password: string) {
        const userDoc = await this.afs.collection('admins').ref.where('email', '==', email).get();
        if (userDoc.docs.length === 0) {
            throw new Error('Lütfen bilgilerinizi kontrol edin.');
        }
        return this.afAuth.signInWithEmailAndPassword(email, password)
            .then(() => {
                this.subscribeUser();
            });
    }
    logout() {
        this.router.navigate(['account/login']);
        return this.afAuth.signOut();
    }
}

