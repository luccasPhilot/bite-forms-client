import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IAnswers } from '../shared/interfaces/answers.interface';
import { IFormData } from '../shared/interfaces/form-data.interface';
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { collection, doc, getDocs,onSnapshot, addDoc, updateDoc } from "firebase/firestore"; 

@Component({
  selector: 'app-voting-page',
  templateUrl: './voting-page.component.html',
  styleUrls: ['./voting-page.component.scss']
})
export class VotingPageComponent implements OnInit {
  // Your web app's Firebase configuration
  firebaseConfig = {
    apiKey: "AIzaSyBsRtNUhJa0tCp11DSEj091k2h-lZseDqk",
    authDomain: "bite-forms-43e4e.firebaseapp.com",
    databaseURL: "https://bite-forms-43e4e-default-rtdb.firebaseio.com",
    projectId: "bite-forms-43e4e",
    storageBucket: "bite-forms-43e4e.appspot.com",
    messagingSenderId: "979829682593",
    appId: "1:979829682593:web:0750f0b17466f6486d5be0"
  };

  // Initialize Firebase
  app = initializeApp(this.firebaseConfig);
  // Initialize Cloud Firestore and get a reference to the service
  db = getFirestore(this.app);
   
  @Input() formData: IFormData;

  id: string;
  selectedAnswer: string;
  title: string;

  hasCopiedUrl = false;
  isResultVisible = false;
  isAnswerSelected = false;
  isResultTimedout = false;

  answers: IAnswers[] = [{
    text: 'abacaxi',
    votes: 5
  },
  {
    text: 'limão',
    votes: 11
  }];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clipboard: Clipboard,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe({
      next: (params) => {
        this.id = params['id']; // ao abrir a página, a variável id recebe o id da url (que foi gerado ao criar o formulário)
        this.getData();
      }
    });
  }

  save() {
    //salvar o voto do usuário no firestore aqui, voto do usuário se encontra na var selectedAnswer
    //quando for exibir os resultados, lembre-se de atualizar os dados (adicionar +1 ao resultado do voto da requisição que foi feita ao abrir o componente ou salvar voto -> realizar a requisição de novo e exibir)
    this.showResults();
  }

  async getData() {
    const questionDocRef = collection(this.db, 'forms'); 
    const answersColectionRef = collection(this.db, 'forms', 'kuayLn5dyp6vTvfwZ0T6', 'answers'); 
    const answersDocRef = doc(this.db, 'forms', 'kuayLn5dyp6vTvfwZ0T6', 'answers', 'q7BBLenxj3kn3yKpnpIk'); 

    let querySnapshot1 = await getDocs(questionDocRef);
    querySnapshot1.forEach((doc) => {
      this.title = doc.data()['title'];/* receba o título */ 
    });

    let querySnapshot2 = await getDocs(answersColectionRef);
    querySnapshot2.forEach((doc) => {

      this.answers = [];
      for(let i=0; i<doc.data()['options'].length; i++){
        this.answers.push({
          text: doc.data()['options'][i],
          votes: doc.data()['votes'][i]
        });
      }
    });

    onSnapshot(answersDocRef, (doc) => {
      this.updateVotes(doc.data())
      console.log('mudou');
  });
  }

  updateVotes(data: any){
    let votesArray = data.votes;
    for(let i=0; i<data.votes.length; i++){
      this.answers[i].votes = data.votes[i];
    }
    console.log(votesArray);
  }

  selectAnswer(answer: IAnswers) {
    this.selectedAnswer = answer.text;
    this.isAnswerSelected = true;
  }

  showResults() {
    this.isResultVisible = true;
    this.isResultTimedout = true;

    setTimeout(() => {
      this.isResultTimedout = false;
    }, 5000);
  }

  copyURL() {
    const url = window.location.href;
    this.clipboard.copy(url);
    this.hasCopiedUrl = true;

    setTimeout(() => {
      this.hasCopiedUrl = false;
    }, 2000);
  }

  redirectToMainPage() {
    this.router.navigateByUrl(`/`);
  }
}
