import { Component, OnInit } from '@angular/core';
import { Observable, fromEvent, from, timer, of, pipe, interval } from 'rxjs';
import { map, filter, catchError, retry, finalize } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';
import * as _ from 'lodash';

@Component({
  selector: 'app-observable',
  templateUrl: './observable.component.html',
  styleUrls: ['./observable.component.scss']
})
export class ObservableComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log(_.isEmpty({})); // returns true
  }
  simple(){
    // Create simple observable that emits three values
    const myObservable = of(1, 2, 3);
    
    // Create observer object
    const myObserver = {
      next: x => console.log('Observer got a next value: ' + x),
      error: err => console.error('Observer got an error: ' + err),
      complete: () => console.log('Observer got a complete notification'),
    };
    
    // Execute with the observer object
    myObservable.subscribe(myObserver);
    //also use in below format
    // myObservable.subscribe(
    //   x => console.log('Observer got a next value: ' + x),
    //   err => console.error('Observer got an error: ' + err),
    //   () => console.log('Observer got a complete notification')
    // );

    // Logs:
    // Observer got a next value: 1
    // Observer got a next value: 2
    // Observer got a next value: 3
    // Observer got a complete notification
  }
  createConstructor(){
    // This function runs when subscribe() is called
    function sequenceSubscriber(observer) {
      // synchronously deliver 1, 2, and 3, then complete
      observer.next(1);
      observer.next(2);
      observer.next(3);
      observer.complete();
    
      // unsubscribe function doesn't need to do anything in this
      // because values are delivered synchronously
      return {unsubscribe() {}};
    }
    
    // Create a new Observable that will deliver the above sequence
    const sequence = new Observable(sequenceSubscriber);
    
    // execute the Observable and print the result of each notification
    sequence.subscribe({
      next(num) { console.log(num); },
      complete() { console.log('Finished sequence'); }
    });
    
    // Logs:
    // 1
    // 2
    // 3
    // Finished sequence
  }
  createFromEvent(){
    console.log('create from event');
    function fromEvent(target, eventName) {
      return new Observable((observer) => {
        const handler = (e) => observer.next(e);
     
        // Add the event handler to the target
        target.addEventListener(eventName, handler);
     
        return () => {
          // Detach the event handler from the target
          target.removeEventListener(eventName, handler);
        };
      });
    }
    const ESC_KEY = 27;
    const nameInput = document.getElementById('name') as HTMLInputElement;

    const subscription = fromEvent(nameInput, 'keydown')
      .subscribe((e: KeyboardEvent) => {
        console.log('e.keyCode',e.keyCode);
        if (e.keyCode === ESC_KEY) {
          nameInput.value = 'abcd';
        }
      });
  }
  delayedSequence(){
    function sequenceSubscriber(observer) {
      const seq = [1, 2, 3];
      let timeoutId;
     
      // Will run through an array of numbers, emitting one value
      // per second until it gets to the end of the array.
      function doSequence(arr, idx) {
        timeoutId = setTimeout(() => {
          observer.next(arr[idx]);
          if (idx === arr.length - 1) {
            observer.complete();
          } else {
            doSequence(arr, ++idx);
          }
        }, 1000);
      }
     
      doSequence(seq, 0);
     
      // Unsubscribe should clear the timeout to stop execution
      return {unsubscribe() {
        clearTimeout(timeoutId);
      }};
    }
     
    // Create a new Observable that will deliver the above sequence
    const sequence = new Observable(sequenceSubscriber);
     
    sequence.subscribe({
      next(num) { console.log(num); },
      complete() { console.log('Finished sequence'); }
    });
     
    // Logs:
    // (at 1 second): 1
    // (at 2 seconds): 2
    // (at 3 seconds): 3
    // (at 3 seconds): Finished sequence
  }
  twoSubscriptions(){
    function sequenceSubscriber(observer) {
      const seq = [1, 2, 3];
      let timeoutId;
     
      // Will run through an array of numbers, emitting one value
      // per second until it gets to the end of the array.
      function doSequence(arr, idx) {
        timeoutId = setTimeout(() => {
          observer.next(arr[idx]);
          if (idx === arr.length - 1) {
            observer.complete();
          } else {
            doSequence(arr, ++idx);
          }
        }, 1000);
      }
     
      doSequence(seq, 0);
     
      // Unsubscribe should clear the timeout to stop execution
      return {unsubscribe() {
        clearTimeout(timeoutId);
      }};
    }
     
    // Create a new Observable that will deliver the above sequence
    const sequence = new Observable(sequenceSubscriber);
    // Subscribe starts the clock, and will emit after 1 second
    sequence.subscribe({
      next(num) { console.log('1st subscribe: ' + num); },
      complete() { console.log('1st sequence finished.'); }
    });
    
    // After 1/2 second, subscribe again.
    setTimeout(() => {
      sequence.subscribe({
        next(num) { console.log('2nd subscribe: ' + num); },
        complete() { console.log('2nd sequence finished.'); }
      });
    }, 500);
    
    // Logs:
    // (at 1 second): 1st subscribe: 1
    // (at 1.5 seconds): 2nd subscribe: 1
    // (at 2 seconds): 1st subscribe: 2
    // (at 2.5 seconds): 2nd subscribe: 2
    // (at 3 seconds): 1st subscribe: 3
    // (at 3 seconds): 1st sequence finished
    // (at 3.5 seconds): 2nd subscribe: 3
    // (at 3.5 seconds): 2nd sequence finished
  }
  multicastSubscriber(){
    function multicastSequenceSubscriber() {
      const seq = [1, 2, 3];
      // Keep track of each observer (one for every active subscription)
      const observers = [];
      // Still a single timeoutId because there will only ever be one
      // set of values being generated, multicasted to each subscriber
      let timeoutId;
     
      // Return the subscriber function (runs when subscribe()
      // function is invoked)
      return (observer) => {
        observers.push(observer);
        // When this is the first subscription, start the sequence
        if (observers.length === 1) {
          timeoutId = doSequence({
            next(val) {
              // Iterate through observers and notify all subscriptions
              observers.forEach(obs => obs.next(val));
            },
            complete() {
              // Notify all complete callbacks
              observers.slice(0).forEach(obs => obs.complete());
            }
          }, seq, 0);
        }
     
        return {
          unsubscribe() {
            // Remove from the observers array so it's no longer notified
            observers.splice(observers.indexOf(observer), 1);
            // If there's no more listeners, do cleanup
            if (observers.length === 0) {
              clearTimeout(timeoutId);
            }
          }
        };
      };
    }
     
    // Run through an array of numbers, emitting one value
    // per second until it gets to the end of the array.
    function doSequence(observer, arr, idx) {
      return setTimeout(() => {
        observer.next(arr[idx]);
        if (idx === arr.length - 1) {
          observer.complete();
        } else {
          doSequence(observer, arr, ++idx);
        }
      }, 1000);
    }
     
    // Create a new Observable that will deliver the above sequence
    const multicastSequence = new Observable(multicastSequenceSubscriber());
     
    // Subscribe starts the clock, and begins to emit after 1 second
    multicastSequence.subscribe({
      next(num) { console.log('1st subscribe: ' + num); },
      complete() { console.log('1st sequence finished.'); }
    });
     
    // After 1 1/2 seconds, subscribe again (should "miss" the first value).
    setTimeout(() => {
      multicastSequence.subscribe({
        next(num) { console.log('2nd subscribe: ' + num); },
        complete() { console.log('2nd sequence finished.'); }
      });
    }, 1500);
     
    // Logs:
    // (at 1 second): 1st subscribe: 1
    // (at 2 seconds): 1st subscribe: 2
    // (at 2 seconds): 2nd subscribe: 2
    // (at 3 seconds): 1st subscribe: 3
    // (at 3 seconds): 1st sequence finished
    // (at 3 seconds): 2nd subscribe: 3
    // (at 3 seconds): 2nd sequence finished
  }
  createFromPromise(){
    // Create an Observable out of a promise
    const data = from(fetch('http://localhost:3000/profile'));

    data.pipe(
      finalize(() => console.log('complete abcde')) // Execute when the observable completes
    ).subscribe((resp)=> {
      console.log({resp});
    }, (err) => {
      console.log({err});
      
    })
    // Subscribe to begin listening for async result
    // data.subscribe({
    //   next(response) { console.log(response); },
    //   error(err) { console.error('Error: ' + err); },
    //   complete() { console.log('Completed'); }
    // });
  }
  createFromCounter(){
    // Create an Observable that will publish a value on an interval
    const secondsCounter = interval(1000);
    // Subscribe to begin publishing values
    secondsCounter.subscribe(n =>
      console.log(`It's been ${n} seconds since subscribing!`));
  }
  createFromEventNormal(){
    const el = document.getElementById('my-element');
    
    // Create an Observable that will publish mouse movements
    const mouseMoves = fromEvent(el, 'mousemove');
    
    // Subscribe to start listening for mouse-move events
    const subscription = mouseMoves.subscribe((evt: MouseEvent) => {
      // Log coords of mouse movements
      console.log(`Coords: ${evt.clientX} X ${evt.clientY}`);
    
      // When the mouse is over the upper-left of the screen,
      // unsubscribe to stop listening for mouse movements
      if (evt.clientX < 40 && evt.clientY < 40) {
        subscription.unsubscribe();
      }
    });
  }
  createFromAjax(){
    // Create an Observable that will create an AJAX request
    const apiData = ajax('http://localhost:3000/profile');
    // Subscribe to create the request
    apiData.subscribe(res => console.log(res.status, res.response));
  }
  mapOperator(){
    const nums = of(1, 2, 3);
    
    const squareValues = map((val: number) => val * val);
    const squaredNums = squareValues(nums);
    
    squaredNums.subscribe(x => console.log(x));
    
    // Logs
    // 1
    // 4
    // 9
  }
  pipeOperator(){
    const nums = of(1, 2, 3, 4, 5);
    
    // Create a function that accepts an Observable.
    const squareOddVals = pipe(
      filter((n: number) => n % 2 !== 0),
      map(n => n * n)
    );
    
    // Create an Observable that will run the filter and map functions
    const squareOdd = squareOddVals(nums);
    
    // Suscribe to run the combined functions
    squareOdd.subscribe(x => console.log(x));
  }
  catcherrorOperator(){
    // Return "response" from the API. If an error happens,
    // return an empty array.
    const apiData = ajax('http://localhost:3000/profile').pipe(
      map(res => {
          if (!res.response) {
            throw new Error('Value expected!');
          }
          return res.response;
        }),
        catchError(err => of([]))
      );
      
      apiData.subscribe({
        next(x) { console.log('data: ', x); },
        error(err) { console.log('errors already caught... will not run'); }
      });
  }
  retryOperator(){
    const apiData = ajax('/api/data').pipe(
      retry(2), // Retry up to 3 times before failing
      map(res => {
        if (!res.response) {
          throw new Error('Value expected!');
        }
        return res.response;
      }),
      catchError(err => of([]))
    );
     
    apiData.subscribe({
      next(x) { console.log('data: ', x); },
      error(err) { console.log('errors already caught... will not run'); }
    });
  }
  //------------------------------------------------------------------------------------------------
  createObservable(){
    const observable = Observable.create( observer => {
        observer.next( 'hello' )
        observer.next( 'world' )
    })
    
    observable.subscribe(val => console.log(val))
  }
  createObservableFromEvent(){
    const clicks = fromEvent(document, 'click')

    clicks.subscribe(click => console.log(click))
    // click around the web page...
    // MouseEvent<data>
    // MouseEvent<data>
  }
  createObservableFromPromise(){
    const promise = new Promise((resolve, reject) => { 
        setTimeout(() => {
            resolve('resolved!')
        }, 1000)
    });
        
    const obsvPromise = from(promise)
    
    obsvPromise.subscribe(result => console.log(result) ) 
    
    // wail 1 second...
    // resolved!
  }
  createObservableFromMix(){
    //observable timer
    const timerv = timer(1000)

    timerv.subscribe(done => console.log('ding!!!'))
    //observable interval
    const intervalNew = interval(1000)

    intervalNew.subscribe(i => console.log( i ))
    // 0
    // 1
    // every second for eternity...
    //observable of static values
    const mashup = of('anything', ['you', 'want'], 23, true, {cool: 'stuff'})

    mashup.subscribe(val => console.log( val ))
  }
mapOperaterSecond(){
  // console.log('error');
  const numbersNew = from([10, 100, 1000]);

  numbersNew.pipe(
    map(num => Math.log(num) ))
    .subscribe(x => console.log(x))
    // 2.3
    // 4.6
    // 6.9
  const tweet = of(1,2,3,4,5)

  tweet.pipe(
    filter(tweet => tweet == 1 ))
    .subscribe()
  }
}
