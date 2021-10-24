import { Component, OnInit } from '@angular/core';
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

  dateParser(date: string) {
    const newDate = date.split(' ')[1].split('.');
    return new Date(
      +newDate[2],
      +newDate[1] - 1 < 1 ? 12 : +newDate[1] - 1,
      +newDate[0]
    );
  }

  isTodayAvailable(date: string): boolean {
    return (
      this.dateParser(date).setHours(0, 0, 0, 0) ===
      this.currentDate.setHours(0, 0, 0, 0)
    );
  }

  ngOnInit(): void {
    this.menusService.getFromNode('veroni-coffee').subscribe((res: any) => {
      for (let item of res) {
        if (this.isTodayAvailable(item.date)) {
          this.veroniItemsToDisplay = item.item;
        }
      }
    });

    this.menusService.getFromNode('suzies').subscribe((res: any) => {
      for (let item of res) {
        if (this.isTodayAvailable(item.date)) {
          this.suziesItemsToDiplay.push(
            `${item.title}: ${item.item.replace(/\s+/g, ' ')}`
          );
        }
      }
      if (this.suziesItemsToDiplay.length < 1)
        this.suziesItemsToDiplay.push(this.defaultItemsMissingMessage);
    });

    this.menusService.getFromNode('denni-menu').subscribe((res: any) => {
      for (let item of res) {
        const date = item.date.replace(/\s+/g, '');
        if (this.isTodayAvailable(` ${date}`)) {
          for (let menuItem of item.item) {
            this.denniItemsToDiplay.push(menuItem);
          }
        }
      }
      if (this.denniItemsToDiplay.length < 1)
        this.denniItemsToDiplay.push(this.defaultItemsMissingMessage);
      console.log('denni-menu res: ', res);
    });
  }
}
