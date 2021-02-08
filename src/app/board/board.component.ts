/*
Board on ns. toiminnallinen eli "älykäs" komponentti joka sisältää
sovelluslogiikan.
*/
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SquareComponent } from '../square/square.component';
import { StatisticsService } from '../statistics.service';

@Component({
    selector: 'app-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
    // Pelin tila eli state tallennetaan squares -taulukkoon
    squares: any[]; // Taulukko jossa on eri tyyppisiä arvoja: null, 'X', '0'
    xIsNext: boolean; // Kertoo kumpi on seuraavaksi vuorossa
    winner: string; // Kertoo voittajan 'X' tai '0'
    moves: number;
    line: number[];

    oScores;
    xScores;

    constructor(private statisticsService: StatisticsService) { }

    ngOnInit() {
        this.newGame(); // newGame suoritetaan aina kun komponentti alustetaan
        if(localStorage.getItem('O')) this.statisticsService.createStatBoard();
        this.updateScore();
    }
    // newGame() -metodin suoritus käynnistää uuden pelin
    newGame() {
        // Kun uusi peli alkaa, pelin muuttujat alustetaan.
        // Squares-taulukkoon laitetaan 9 tyhjää paikkaa
        this.squares = Array(9).fill(null);
        /* 
        Kun peli alkaa 0 aloittaa, kun
        peli loppuu tarkastellaan kumpi teki
        viimeisimmän siirron ja annetaan vuoro toiselle.
        */
        this.xIsNext ? false : true;
        this.winner = null;
        this.moves = 0;
        this.line = [];
    }

    /*
   Tässä on sovelluksen model eli tietomalli. Se muodostuu
   risteistä ja nollista jotka välitetään ruutuihin player-
   get propertyn kautta. Get property joka on TS:n piirre,
   tarjoilee vuorotellen ristin tai nollan.
   */
    get player() {
        // ternäärinen operaattori joka korvaa if-elsen
        return this.xIsNext ? 'X' : '0';
        /*
        if (this.xIsNext) {
            return 'X';
        } else {
            return '0';
        }
        */
    }

    // makeMove(index: number) laittaa ristin tai nollan squares -taulukkoon indeksiin index
    makeMove(index: number) {
        // Paikan johon risti tai nolla laitetaan pitää olla tyhjä, eli null
        // Siirto voidaan tehdä vain, jos voittajaa ei ole
        if (!this.squares[index] && !this.winner) {
            // splice-metodi poistaa indeksistä alkion ja laittaa
            // tilalle yhden alkion joka tulee this.player -get propertyltä
            this.squares.splice(index, 1, this.player);
            this.xIsNext = !this.xIsNext; // Vaihdetaan vuoroa
        }
        
        // Yritetään määritellä voittaja. Metodi tuottaa 'X', '0' tai null
        // tilanteesta riippuen. Jos voittaja on olemassa, se näytetään templaatissa.
        if(!this.winner) {
            this.winner = this.calculateWinner();
            this.updateScore();
        }
        this.moves++;
    }
    // Metodi joka määrittää pelin voittajan
    calculateWinner() {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (const line of lines) {
            const [a, b, c] = line;

            if (
                this.squares[a] &&
                this.squares[a] === this.squares[b] &&
                this.squares[a] === this.squares[c]
            ) {
                // Otetaan voittava "line" talteen.
                this.line = line;
                // Lisätään voittajalle piste
                this.statisticsService.addPoint(this.squares[a]);
                return this.squares[a]; // palautetaan 'X' tai '0'
            }
        }
        return null;
    }

    updateScore() {
        this.oScores = this.statisticsService.get('0');
        this.xScores = this.statisticsService.get('X');
    }

    nullScores() {
        this.statisticsService.clear();
        this.updateScore();
    }
}
