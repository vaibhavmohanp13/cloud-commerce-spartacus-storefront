import { DebugElement, Pipe, PipeTransform } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { ProductService, Product, CmsComponent } from '@spartacus/core';

import { of, Observable } from 'rxjs';

import { BootstrapModule } from '../../bootstrap.module';
import { CmsService } from '@spartacus/core';
import { PictureComponent } from '../../ui/components/media/picture/picture.component';

import { ProductCarouselComponent } from './product-carousel.component';

@Pipe({
  name: 'cxTranslateUrl'
})
class MockTranslateUrlPipe implements PipeTransform {
  transform() {}
}

const productCodeArray: string[] = ['111111', '222222', '333333', '444444'];

const mockComponentData: any = {
  uid: '001',
  typeCode: 'ProductCarouselComponent',
  modifiedTime: '2017-12-21T18:15:15+0000',
  popup: 'false',
  productCodes: productCodeArray.join(' '),
  scroll: 'ALLVISIBLE',
  title: 'Mock Title',
  name: 'Mock Product Carousel',
  type: 'Product Carousel',
  container: 'false'
};

const mockProduct: Product = {
  code: 'C001',
  name: 'Camera',
  price: {
    formattedValue: '$100.00'
  }
};

class MockCmsService {
  getComponentData<T extends CmsComponent>(): Observable<T> {
    return of(mockComponentData);
  }
}

class MockProductService {
  get(): Observable<any> {
    return of(mockProduct);
  }

  isProductLoaded(): Observable<boolean> {
    return of(true);
  }
}

describe('ProductCarouselComponent', () => {
  let productCarouselComponent: ProductCarouselComponent;
  let fixture: ComponentFixture<ProductCarouselComponent>;
  let el: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, BootstrapModule],
      declarations: [
        ProductCarouselComponent,
        PictureComponent,
        MockTranslateUrlPipe
      ],
      providers: [
        { provide: CmsService, useClass: MockCmsService },
        { provide: ProductService, useClass: MockProductService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCarouselComponent);
    fixture.detectChanges();
    productCarouselComponent = fixture.componentInstance;
    fixture.detectChanges();
    el = fixture.debugElement;
  });

  it('should be created', () => {
    expect(productCarouselComponent).toBeTruthy();
  });

  it('should have empty productCodes', () => {
    expect(productCarouselComponent.productCodes).toBeFalsy();
  });

  it('should have productCodes', () => {
    expect(productCarouselComponent.component).toBeNull();
    productCarouselComponent.onCmsComponentInit(mockComponentData.uid);
    expect(productCarouselComponent.productCodes).toEqual(productCodeArray);
  });

  it('should have 1 group', () => {
    spyOn<any>(productCarouselComponent, 'getItemsPerPage').and.returnValue(4);
    productCarouselComponent.onCmsComponentInit(mockComponentData.uid);
    expect(productCarouselComponent.productGroups.length).toBe(1);
  });

  it('should contain cms content in the html rendering after bootstrap', () => {
    productCarouselComponent.onCmsComponentInit(mockComponentData.uid);
    expect(
      el.query(By.css('.cx-carousel__header')).nativeElement.textContent
    ).toEqual(productCarouselComponent.component.title);
  });
});
