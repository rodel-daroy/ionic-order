import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddressListPage } from './address-list.page';

describe('AddressListPage', () => {
  let component: AddressListPage;
  let fixture: ComponentFixture<AddressListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddressListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
