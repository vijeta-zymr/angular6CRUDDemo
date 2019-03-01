import { Component, OnInit } from '@angular/core';
// RxJS v6+
import { take, map, combineAll, mapTo, startWith, scan, tap, concat, delay, concatAll, mergeMap, mergeAll, retry, retryWhen, delayWhen, takeUntil, filter, withLatestFrom, debounceTime } from 'rxjs/operators';
import { interval, timer, combineLatest, fromEvent, of, forkJoin, race, throwError } from 'rxjs';

@Component({
  selector: 'app-learnrxjs',
  templateUrl: './learnrxjs.component.html',
  styleUrls: ['./learnrxjs.component.scss']
})
export class LearnrxjsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  combineAll(){
    console.log('in combine all');
    //emit every 1s, take 2
    const source = interval(1000).pipe(take(2));
    //map each emitted value from source to interval observable that takes 5 values
    const example = source.pipe(
      map(val => interval(1000).pipe(map(i => `Result (${val}): ${i}`), take(5)))
    );
    /*
      2 values from source will map to 2 (inner) interval observables that emit every 1s
      combineAll uses combineLatest strategy, emitting the last value from each
      whenever either observable emits a value
    */
    const combined = example.pipe(combineAll());
    /*
      output:
      ["Result (0): 0", "Result (1): 0"]
      ["Result (0): 1", "Result (1): 0"]
      ["Result (0): 1", "Result (1): 1"]
      ["Result (0): 2", "Result (1): 1"]
      ["Result (0): 2", "Result (1): 2"]
      ["Result (0): 3", "Result (1): 2"]
      ["Result (0): 3", "Result (1): 3"]
      ["Result (0): 4", "Result (1): 3"]
      ["Result (0): 4", "Result (1): 4"]
    */
    const subscribe = combined.subscribe(val => console.log(val));
  }

  combineLatest(){
    //timerOne emits first value at 1s, then once every 4s
    const timerOne = timer(1000, 4000);
    //timerTwo emits first value at 2s, then once every 4s
    const timerTwo = timer(2000, 4000);
    //timerThree emits first value at 3s, then once every 4s
    const timerThree = timer(3000, 4000);

    //when one timer emits, emit the latest values from each timer as an array
    const combined = combineLatest(timerOne, timerTwo, timerThree);

    const subscribe = combined.subscribe(
      ([timerValOne, timerValTwo, timerValThree]) => {
        /*
          Example:
        timerOne first tick: 'Timer One Latest: 1, Timer Two Latest:0, Timer Three Latest: 0
        timerTwo first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 0
        timerThree first tick: 'Timer One Latest: 1, Timer Two Latest:1, Timer Three Latest: 1
      */
        console.log(
          `Timer One Latest: ${timerValOne},
        Timer Two Latest: ${timerValTwo},
        Timer Three Latest: ${timerValThree}`
        );
      }
    );
  }
  combineProject(){

    //timerOne emits first value at 1s, then once every 4s
    const timerOne = timer(1000, 4000);
    //timerTwo emits first value at 2s, then once every 4s
    const timerTwo = timer(2000, 4000);
    //timerThree emits first value at 3s, then once every 4s
    const timerThree = timer(3000, 4000);

    //combineLatest also takes an optional projection function
    const combinedProject = combineLatest(
      timerOne,
      timerTwo,
      timerThree,
      (one, two, three) => {
        return `Timer One (Proj) Latest: ${one}, 
                  Timer Two (Proj) Latest: ${two}, 
                  Timer Three (Proj) Latest: ${three}`;
      }
    );
    //log values
    const subscribe = combinedProject.subscribe(latestValuesProject =>
      console.log(latestValuesProject)
    );
  }
  combineFrom2Buttons(){
    // helper function to set HTML
    const setHtml = id => val => (document.getElementById(id).innerHTML = val);

    const addOneClick$ = id =>
      fromEvent(document.getElementById(id), 'click').pipe(
        // map every click to 1
        mapTo(1),
        startWith(0),
        // keep a running total
        scan((acc, curr) => acc + curr),
        // set HTML for appropriate element
        tap(setHtml(`${id}Total`))
      );

    const combineTotal$ = combineLatest(addOneClick$('red'), addOneClick$('black'))
      .pipe(map(([val1, val2]) => val1 + val2))
      .subscribe(setHtml('total')); 
  }
  concatDelay(){
    //emits 1,2,3
    const sourceOne = of(1, 2, 3);
    //emits 4,5,6
    const sourceTwo = of(4, 5, 6);

    //delay 3 seconds then emit
    const sourceThree = sourceOne.pipe(delay(3000));
    //sourceTwo waits on sourceOne to complete before subscribing
    const example = sourceThree.pipe(concat(sourceTwo));
    //output: 1,2,3,4,5,6
    const subscribe = example.subscribe(val =>
      console.log('Example: Delayed source one:', val)
    );
  }
  concatAll(){
    //emit a value every 2 seconds
    const source = interval(2000);
    const example = source.pipe(
      //for demonstration, add 10 to and return as observable
      map(val => of(val + 10)),
      //merge values from inner observable
      concatAll()
    );
    //output: 'Example with Basic Observable 10', 'Example with Basic Observable 11'...
    const subscribe = example.subscribe(val =>
      console.log('Example with Basic Observable:', val)
    );
  }
  concatAllPromise(){
    //create and resolve basic promise
    const samplePromise = val => new Promise(resolve => resolve(val));
    //emit a value every 2 seconds
    const source = interval(2000);

    const example = source.pipe(
      map(val => samplePromise(val)),
      //merge values from resolved promise
      concatAll()
    );
    //output: 'Example with Promise 0', 'Example with Promise 1'...
    const subscribe = example.subscribe(val =>
      console.log('Example with Promise:', val)
    );
  }
  forkJoin(){
    const myPromise = val =>
    new Promise(resolve =>
      setTimeout(() => resolve(`Promise Resolved: ${val}`), 5000)
    );

  const source = of([1, 2, 3, 4, 5]);
  //emit array of all 5 results
  const example = source.pipe(mergeMap(q => forkJoin(...q.map(myPromise))));
  /*
    output:
    [
    "Promise Resolved: 1",
    "Promise Resolved: 2",
    "Promise Resolved: 3",
    "Promise Resolved: 4",
    "Promise Resolved: 5"
    ]
  */
  const subscribe = example.subscribe(val => console.log(val));
  }
  mergeAllPromise(){
    const myPromise = val =>
      new Promise(resolve => setTimeout(() => resolve(`Result: ${val}`), 2000));
    //emit 1,2,3
    const source = of(1, 2, 3);

    const example = source.pipe(
      //map each value to promise
      map(val => myPromise(val)),
      //emit result from source
      mergeAll()
    );

    /*
      output:
      "Result: 1"
      "Result: 2"
      "Result: 3"
    */
    const subscribe = example.subscribe(val => console.log(val));
  }
  mergeAllConcurrent(){
    const source = interval(500).pipe(take(5));

    /*
      interval is emitting a value every 0.5s.  This value is then being mapped to interval that
      is delayed for 1.0s.  The mergeAll operator takes an optional argument that determines how
      many inner observables to subscribe to at a time.  The rest of the observables are stored
      in a backlog waiting to be subscribe.
    */
    const example = source
      .pipe(
        map(val =>
          source.pipe(
            delay(1000),
            take(3)
          )
        ),
        mergeAll(2)
      )
      .subscribe(val => console.log(val));
    /*
      The subscription is completed once the operator emits all values.
    */
  }
  race(){
    //take the first observable to emit
    const example = race(
      //emit every 1.5s
      interval(1500),
      //emit every 1s
      interval(1000).pipe(mapTo(100)),
      //emit every 2s
      interval(2000),
      //emit every 2.5s
      interval(2500)
    );
    //output: "1s won!"..."1s won!"...etc
    const subscribe = example.subscribe(val => console.log(val));
  }
  retry(){
    //emit value every 1s
    const source = interval(1000);
    const example = source.pipe(
      mergeMap(val => {
        //throw error for demonstration
        if (val > 5) {
          return throwError('Error!');
        }
        return of(val);
      }),
      //retry 2 times on error
      retry(2)
    );
    /*
      output:
      0..1..2..3..4..5..
      0..1..2..3..4..5..
      0..1..2..3..4..5..
      "Error!: Retried 2 times then quit!"
    */
    const subscribe = example.subscribe({
      next: val => console.log(val),
      error: val => console.log(`${val}: Retried 2 times then quit!`)
    });
  }
  retryWhen(){
    //emit value every 1s
    const source = interval(1000);
    const example = source.pipe(
      map(val => {
        if (val > 5) {
          //error will be picked up by retryWhen
          throw val;
        }
        return val;
      }),
      retryWhen(errors =>
        errors.pipe(
          //log error message
          tap(val => console.log(`Value ${val} was too high!`)),
          //restart in 6 seconds
          delayWhen(val => timer(val * 1000))
        )
      )
    );
    /*
      output:
      0
      1
      2
      3
      4
      5
      "Value 6 was too high!"
      --Wait 6 seconds then repeat
    */
    const subscribe = example.subscribe(val => console.log(val));
  }
  takeUntill(){
    //emit value every 1s
    const source = interval(1000);
    //after 5 seconds, emit value
    const timer$ = timer(5000);
    //when timer emits after 5s, complete source
    const example = source.pipe(takeUntil(timer$));
    //output: 0,1,2,3
    const subscribe = example.subscribe(val => console.log(val));
  }
  takeUntillEven(){
    //emit value every 1s
    const source = interval(1000);
    //is number even?
    const isEven = val => val % 2 === 0;
    //only allow values that are even
    const evenSource = source.pipe(filter(isEven));
    //keep a running total of the number of even numbers out
    const evenNumberCount = evenSource.pipe(scan((acc, _) => acc + 1, 0));
    //do not emit until 5 even numbers have been emitted
    const fiveEvenNumbers = evenNumberCount.pipe(filter(val => val > 5));

    const example = evenSource.pipe(
      //also give me the current even number count for display
      withLatestFrom(evenNumberCount),
      map(([val, count]) => `Even number (${count}) : ${val}`),
      //when five even numbers have been emitted, complete source observable
      takeUntil(fiveEvenNumbers)
    );
    /*
        Even number (1) : 0,
      Even number (2) : 2
        Even number (3) : 4
        Even number (4) : 6
        Even number (5) : 8
    */
    const subscribe = example.subscribe(val => console.log(val));
  }
  debounceTime(){
    const input = document.getElementById('example');

    //for every keyup, map to current input value
    const example = fromEvent(input, 'keyup').pipe(map(i => i.currentTarget));
    console.log('example',example);
    
    //wait .5s between keyups to emit current value
    //throw away all other values
    const debouncedInput = example.pipe(debounceTime(500));

    //log values
    const subscribe = debouncedInput.subscribe(val => {
      console.log(`Debounced Input: ${val}`);
    });

  }
}
