import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MenusService } from '../services/menus.service';

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.scss'],
})
export class ScraperComponent implements OnInit {
  currentDate = new Date();
  defaultItemsMissingMessage: string = 'No items in the menu for today';
  veroniItemsToDisplay: string = this.defaultItemsMissingMessage;
  suziesItemsToDiplay: string[] = [];
  denniItemsToDiplay: string[] = [];

  constructor(private menusService: MenusService) {}

  isTodayAvailable(date: string): boolean {
    const newDate = date.split(' ')[1].split('.');
    return (
      new Date(
        +newDate[2],
        +newDate[1] - 1 < 1 ? 12 : +newDate[1] - 1,
        +newDate[0]
      ).setHours(0, 0, 0, 0) === this.currentDate.setHours(0, 0, 0, 0)
    );
  }

  handleVeroniData(veroni: any) {
    for (let item of veroni) {
      if (this.isTodayAvailable(item.date)) {
        console.log('Pro tento den nebylo zadáno menu. ', item.item.toString());
        this.veroniItemsToDisplay = item.item;
      }
    }
  }

  handleSuziesData(suzies: any) {
    for (let item of suzies) {
      if (this.isTodayAvailable(item.date)) {
        this.suziesItemsToDiplay.push(
          `${item.title}: ${item.item.replace(/\s+/g, ' ')}`
        );
      }
    }
    if (this.suziesItemsToDiplay.length < 1)
      this.suziesItemsToDiplay.push(this.defaultItemsMissingMessage);
  }

  handleDenniData(denni: any) {
    for (let item of denni) {
      const date = item.date.replace(/\s+/g, '');
      if (this.isTodayAvailable(` ${date}`)) {
        for (let menuItem of item.item) {
          this.denniItemsToDiplay.push(menuItem);
        }
      }
    }
    if (this.denniItemsToDiplay.length < 1)
      this.denniItemsToDiplay.push(this.defaultItemsMissingMessage);
  }

  ngOnInit(): void {
    forkJoin([
      this.menusService.getFromNodeScrapper('veroni_coffee'),
      this.menusService.getFromNodeScrapper('suzies'),
      this.menusService.getFromNodeScrapper('denni_menu'),
    ]).subscribe(([veroni, suzies, denni]) => {
      this.handleVeroniData(veroni);
      this.handleSuziesData(suzies);
      this.handleDenniData(denni);
    });
  }
}
