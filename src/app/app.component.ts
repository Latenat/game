import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

@Component({
  selector: 'app-root',
  animations: [
    trigger(
      'coolEnter',
      [
        transition(
          ':enter', [
            style({ transform: 'translateX(100%)', opacity: 0 }),
            animate('800ms', style({ transform: 'translateX(0)', 'opacity': 1 }))
          ]
        ),
        transition(
          ':leave', [
            style({ 'opacity': 1 }),
            animate('50ms', style({ 'opacity': 0 }),
            )]
        )]
    ),
    trigger(
      'message',
      [
        transition(
          ':enter', [
            style({ transform: 'translateY(100%)', opacity: 0 }),
            animate('800ms', style({ transform: 'translateX(0)', 'opacity': 1 }))
          ]
        ),
      ]
    ),
    trigger(
      'exit',
      [
        transition(
          ':enter', [
            style({ display:'none', opacity: 0 }),
            animate('800ms', style({ 'display':'block', 'opacity': 1 }))
          ]
        ),
      ]
    )
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'game';
  nameForm: FormGroup;
  name: string;
  perso;
  dungeon;
  win = false;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.nameForm = this.formBuilder.group({
      name: ['', [Validators.required]],
    });
  }

  onSubmit() {
    let name = this.nameForm.get('name').value;
    this.name = name
    this.perso = new Perso(this.name, 10, 10, 2);
  }

  createDungeon() {
    this.dungeon = new Dungeon;
    this.perso.addMessage('You entered into the dungeon');
  }
  getDown() {
    this.dungeon.getDown();
    this.perso.addMessage('You getting down inside the dungeon');
  }
  leaveDungeon() {
    this.dungeon = '';
    this.perso.addMessage('You finished the dungeon');
    let gold = Math.floor(Math.random() * (10 - 4 + 1)) + 4;
    this.perso.gold += gold;
    this.perso.addMessage('You win ' + gold + ' gold');
    this.perso.fame += 1;
    this.perso.addMessage('You win 1 fame');
    if(this.perso.fame == 5){
      this.win = true;
    }
  }
  onRestart() {
    this.perso = '';
    this.dungeon = '';
    this.win = false;
  }

}

class Dungeon {
  maxLevel: number;
  currentLevel: number = 1;
  ennemy: Perso;
  status: string = 'unexplored'
  listEnnemy = [{ 'name': 'Gobelin', 'life': 3, 'strength': 1 },
  { 'name': 'Hopgobelin', 'life': 5, 'strength': 1 },
  { 'name': 'Dark Elf', 'life': 3, 'strength': 2 }]
  constructor() {
    this.maxLevel = Math.floor(Math.random() * (8 - 3 + 1)) + 3;
    let idEnnemy = Math.floor(Math.random() * (this.listEnnemy.length - 0)) + 0;
    this.ennemy = new Perso(this.listEnnemy[idEnnemy].name, this.listEnnemy[idEnnemy].life, this.listEnnemy[idEnnemy].life, this.listEnnemy[idEnnemy].strength);
  }
  getDown() {
    this.currentLevel++;
    let idEnnemy = Math.floor(Math.random() * (this.listEnnemy.length - 0)) + 0;
    this.ennemy = new Perso(this.listEnnemy[idEnnemy].name, this.listEnnemy[idEnnemy].life, this.listEnnemy[idEnnemy].life, this.listEnnemy[idEnnemy].strength);
    if (this.currentLevel == this.maxLevel) {
      this.status = 'explored';
    }
  }
}

class Perso {
  name: string;
  currentLife: number;
  maxLife: number;
  strength: number;
  gold: number = 5;
  potion: number = 1;
  messages = [];
  fame: number = 0;
  status: string = 'alive';
  constructor(name: string, currentLife: number, maxLife: number, strength: number) {
    this.name = name;
    this.currentLife = currentLife;
    this.maxLife = maxLife;
    this.strength = strength;
  }

  addMessage(message) {
    this.messages.unshift(message);
  }

  usePotion() {
    if (this.potion == 0) {
      this.addMessage("Not enough potion")
    }

    else if (this.currentLife == this.maxLife) {
      this.addMessage("You're healthy")
    }
    else {
      this.potion--;
      this.currentLife += 5;
      if (this.currentLife > this.maxLife) {
        this.currentLife = this.maxLife;
      }
      this.addMessage(this.potion + " potion left")
    }
  }

  buyRest() {
    if (this.gold < 5) {
      this.addMessage("Not enough gold")
    }

    else if (this.currentLife == this.maxLife) {
      this.addMessage("You're healthy")
    }

    else {
      this.currentLife = this.maxLife;
      this.gold -= 5;
    }
  }

  buyPotion() {
    if (this.gold < 5) {
      this.addMessage("Not enough gold")
    }

    else {
      this.potion++;
      this.gold -= 5;
      this.addMessage('You have ' + this.potion + " potion(s)")
    }
  }

  buyStrength() {
    if (this.gold < 15) {
      this.addMessage("Not enough gold")
    }
    else {
      this.strength++
      this.gold -= 15;
    }
  }

  buyLife() {
    if (this.gold < 10) {
      this.addMessage("Not enough gold")
    }
    else {
      this.maxLife += 5;
      this.gold -= 10;
    }
  }

  fight(ennemy) {
    ennemy.currentLife -= this.strength;
    this.addMessage('You inflicted ' + this.strength + ' point(s) to ' + ennemy.name)
    if (ennemy.currentLife <= 0) {
      this.addMessage(ennemy.name + ' is dead')
      ennemy.status = 'dead';
    }
    else {
      this.currentLife -= ennemy.strength;
      this.addMessage(ennemy.name + ' inflicted ' + ennemy.strength + ' point(s) you')
      if (this.currentLife <= 0) {
        this.status = 'dead';
        this.addMessage('You are dead')
      }
    }
  }
}


