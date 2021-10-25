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
  veroniItemsToDisplay: string[] = [];
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

  handleEmptyItemsToDisplay(items: any[]) {
    if (items.length < 1) items.push(this.defaultItemsMissingMessage);
  }

  handleVeroniData(veroni: any) {
    for (let item of veroni)
      if (this.isTodayAvailable(item.date))
        for (item of item.item) this.veroniItemsToDisplay.push(item);
    this.handleEmptyItemsToDisplay(this.veroniItemsToDisplay);
  }

  handleSuziesData(suzies: any) {
    for (let item of suzies)
      if (this.isTodayAvailable(item.date))
        this.suziesItemsToDiplay.push(
          `${item.title}: ${item.item.replace(/\s+/g, ' ')}`
        );
    this.handleEmptyItemsToDisplay(this.suziesItemsToDiplay);
  }

  handleDenniData(denni: any) {
    for (let item of denni) {
      const date = item.date.replace(/\s+/g, '');
      if (this.isTodayAvailable(` ${date}`))
        for (let menuItem of item.item) this.denniItemsToDiplay.push(menuItem);
    }
    this.handleEmptyItemsToDisplay(this.denniItemsToDiplay);
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
