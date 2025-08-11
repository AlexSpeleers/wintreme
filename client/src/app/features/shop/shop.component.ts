import { Component, inject, OnInit } from '@angular/core';
import { ShopService } from 'app/core/services/shop.service';
import { Product } from 'app/shared/models/product';
import { ProductItemComponent } from './product-item/product-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { FiltersDialogComponent } from './filters-dialog/filters-dialog.component';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import {
  MatListOption,
  MatSelectionList,
  MatSelectionListChange,
} from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { ShopParams } from 'app/shared/models/shopParams';
import { Pagination } from 'app/shared/models/pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrl: './shop.component.scss',
  imports: [
    MatCardModule,
    ProductItemComponent,
    MatButton,
    MatIcon,
    MatMenuModule,
    MatSelectionList,
    MatListOption,
    MatMenuTrigger,
    MatPaginatorModule,
    FormsModule,
  ],
})
export class ShopComponent implements OnInit {
  private shopService = inject(ShopService);
  private dialogService = inject(MatDialog);
  protected products?: Pagination<Product>;
  protected hidePageSize = true;
  protected sortOptions = [
    { name: 'Alphabetical', value: 'name' },
    { name: 'Price: Low-high', value: 'priceAsc' },
    { name: 'Price: High-low', value: 'priceDesc' },
  ];
  protected shopParams = new ShopParams();
  protected pageSizeOptions = [5, 10, 15, 20];

  ngOnInit(): void {
    this.InitializeShop();
  }

  InitializeShop(): void {
    this.shopService.GetBrands();
    this.shopService.GetTypes();
    this.GetProducts();
  }

  GetProducts() {
    this.shopService.GetProducts(this.shopParams).subscribe({
      next: (response) => (this.products = response),
      error: (error) => console.error(error),
    });
  }

  OnSearchChange() {
    this.shopParams.pageNumber = 1;
    this.GetProducts();
  }

  HandlePageEvent(event: PageEvent) {
    this.shopParams.pageNumber = event.pageIndex + 1;
    this.shopParams.pageSize = event.pageSize;
    this.GetProducts();
  }

  OnSortChange(evet: MatSelectionListChange) {
    const selectedOption = evet.options[0];
    if (selectedOption) {
      this.shopParams.sort = selectedOption.value;
      this.shopParams.pageNumber = 1;
      this.GetProducts();
    }
  }

  OpenFiltersDialog() {
    const dialogRef = this.dialogService.open(FiltersDialogComponent, {
      minWidth: '500px',
      data: {
        selectedBrands: this.shopParams.brands,
        selectedTypes: this.shopParams.types,
      },
    });
    dialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.shopParams.brands = result.selectedBrands;
          this.shopParams.types = result.selectedTypes;
          this.shopParams.pageNumber = 1;
          this.GetProducts();
        }
      },
    });
  }
}
