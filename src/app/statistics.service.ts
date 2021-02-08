import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor() { 
    
  }
/*
  scoreobj = { 'X': 0, 'O': 0 }; // huomaa ettÃ¤ nollan sijasta avaimena on iso O

  public initScores() {
      localStorage.setItem('scores', JSON.stringify(this.scoreobj));
  }

  public getScores() {
      return JSON.parse(localStorage.getItem('scores'));
  }

  public addScore(winner: string) {
      const scores = this.getScores();
      console.log(winner);
      if (winner === 'X') {
          scores.X++;
      }
      else {
          scores.O++;
      }      
      
      localStorage.setItem('scores', JSON.stringify(scores));
  }*/

  add(key: string, stats: string) {
    localStorage.setItem(key, stats);
  }

  get(key: string) {
    return localStorage.getItem(key);
  }

  addPoint(key: string) {
    // muutetaan saatava merkkijono numeroksi, 
    // jotta piste voidaan antaa.
    let value: number = +this.get(key);
    value++;
    this.add(key, value.toString());
  }

  createStatBoard() {
    this.add('0', '0');
    this.add('X', '0');
  }

  clear() {
    this.createStatBoard();
  }
}
