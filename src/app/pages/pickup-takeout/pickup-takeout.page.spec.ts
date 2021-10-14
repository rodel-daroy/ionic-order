import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PickupTakeoutPage } from './pickup-takeout.page';

describe('PickupTakeoutPage', () => {
  let component: PickupTakeoutPage;
  let fixture: ComponentFixture<PickupTakeoutPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PickupTakeoutPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PickupTakeoutPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
