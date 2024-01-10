

const exp = (function() {


    /*
     *
     *  GLOBALS
     *
     */

    let p = {};

    let settings = {
        nSpins: 1,
        choices: [['Heavy', 'Light'], ['Light', 'Heavy']][Math.floor(Math.random() * 2)]
    };

    jsPsych.data.addProperties({
        spins_per_wheel: settings.nSpins,
        left_option: settings.choices[0],
        right_option: settings.choices[1],
    });

    // define each wedge
    const wedges = [
        {color:"grey", label:"0"},
        {color:"#fe0000", label:"1"},
        {color:"#800001", label:"2"},
        {color:"#fe6a00", label:"3"},
        {color:"#803400", label:"4"},
        {color:"#0094fe", label:"5"},
        {color:"#806b00", label:"6"},
        {color:"#228B22", label:"7"},
        {color:"#007f0e", label:"8"},
        {color:"#ffd800", label:"9"},
        {color:"#00497e", label:"10"},
        {color:"#0026ff", label:"11"},
        {color:"#001280", label:"12"},
        {color:"#b100fe", label:"13"},
    ];

    function getChosenSectors(str) {
        let result = [];
        for (let i = 0; i < str.length; i += 2) {
            result.push(str.slice(i, i + 2));
        };
        result = result.map(str => parseInt(str, 10));
        return [wedges[result[0]], wedges[result[1]], wedges[result[2]], wedges[result[3]]];
    };

    let scoreTracker = 0; // track current score
    let scoreTracker_practice = 0; // track current score
    let time = 1;

   /*
    *
    *   INSTRUCTIONS
    *
    */

    p.howToSpin_heavy = {
        type: jsPsychSurvey,
        pages: [
            [
                {   
                    type:'html',
                    prompt:`<p><b>Welcome!</b></p>
                    <p>During this survey, you'll be competing for a chance to win a <b>$100.00 bonus prize</b>.
                    Specifically, you'll play a game called <b>Spin the Wheel</b>. During the game, you'll earn tokens. The tokens you earn will be entered into a lottery, and if one of your tokens is drawn, you'll win $100.00.</p>
                    <p>To maximize your chances of winning a $100.00 bonus, you'll need to earn as many tokens as possible. Continue to learn how to earn tokens!</p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>To earn tokens, you'll spin prize wheels like this one:</p>
                    <img class="spinner-img" style="display:block; margin:auto" src="./img/02040610.png">`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>The number of tokens you earn for each spin depends on where the wheel lands. For example, if a wheel lands on a 4, you'll earn 4 tokens.</p>
                    <img class="spinner-img" style="display:block; margin:auto" src="./img/02040610.png">`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>In Spin the Wheel, there are two different types of wheels: <b>heavy</b> wheels (which are difficult to spin) and <b>light-weight</b> wheels (which are easy to spin).</p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>To spin a heavy wheel, you must build momentum by tapping the right arrow on your keyboard <b>as fast as possible</b>. 
                    If you do not tap your right arrow as fast as possible, the wheel will not build enough momentum to spin.</p>
                    <p>Next, you'll practice spinning heavy wheels. Then, you'll learn to spin light-weight wheels.</p>`
                },
            ],

        ],
        button_label_finish: 'Next'
    };


    p.howToSpin_light = {
        type: jsPsychSurvey,
        pages: [
            [
                {   
                    type:'html',
                    prompt:`<p>Great job!</p>
                    <p>Now that you know how to spin heavy wheels, you'll learn how to spin light-weight wheels.</p>`
                },
            ],
            [
                {
                    type: 'html',
                    prompt: `<p>To spin a light-weight wheel, you must build momentum by tapping the right arrow on your keyboard <b>at a moderate pace</b>. 
                    If you tap your right arrow either too fast or too slow, the wheel will not build enough momentum to spin.</p>
                    <p>Next, you'll practice spinning light-weight wheels.</p>`
                },
            ],

        ],
        button_label_finish: 'Next'
    };

    function MakeAttnChk() {

        const practiceComplete = {
            type: jsPsychSurvey,
            pages: [
                [
                    {   
                        type:'html',
                        prompt:`<p>Great job!</p>
                        <p>Soon, you'll start earning tokens by playing Spin the Wheel.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next'
        };

        const choiceInstructions = {
            type: jsPsychSurvey,
            pages: [
                [
                    {   
                        type:'html',
                        prompt:`<p>Spin the Wheel takes place in multiple rounds.</p>
                        <p>At the beginning of each round, you'll choose between two wheels: a heavy wheel and a light-weight wheel.
                        Weight will be the only relevant difference between the two wheels; their average value will always be the same.</p>`
                    },
                ],
                [
                    {   
                        type:'html',
                        prompt:`<p>After each choice, you'll spin your chosen wheel ${settings.nSpins} time. Then, the next round will begin.</p>`
                    },
                ],
                [
                    {   
                        type:'html',
                        prompt:`<p>There are 32 rounds in total. Therefore, you'll have 32 opportunities to earn tokens.</p>
                        <p>Your total earnings will be displayed at the top of your screen throughout the game.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next'
        };

        let correctAnswers = [`Earn as many tokens as possible.`, `I'll choose between a heavy wheel and a light-weight wheel.`, `${settings.nSpins}`, `32`];

        const attnChk = {
           type: jsPsychSurveyMultiChoice,
            preamble: `<div class='parent' style='text-align: left; color: rgb(109, 112, 114)'>
                <p><strong>Please answer the following questions.</strong></p>
                </div>`,
            questions: [
                {
                    prompt: "<div style='color: rgb(109, 112, 114)'>What is the goal of Spin the Wheel?</div>", 
                    name: `attnChk1`, 
                    options: [`Earn as many tokens as possible.`, `Spin the wheel as fast as possible.`],
                },
                {
                    prompt: "<div style='color: rgb(109, 112, 114)'>At the beginning of each round...</div>", 
                    name: `attnChk2`, 
                    options: [`I'll choose between two different heavy wheels.`, `I'll choose between two different light-weight wheels.`, `I'll choose between a heavy wheel and a light-weight wheel.`],
                },
                {
                    prompt: "<div style='color: rgb(109, 112, 114)'>After each choice, how many times will you spin your chosen wheel?</div>", 
                    name: `attnChk3`, 
                    options: [`${settings.nSpins}`, `${settings.nSpins + 1}`, `${settings.nSpins + 2}`],
                },
                {
                    prompt: "<div style='color: rgb(109, 112, 114)'>How many rounds are there?</div>", 
                    name: `attnChk4`, 
                    options: [`16`, `32`, `40`],
                },
            ],
            scale_width: 500,
            on_finish: (data) => {
                console.log(data)
                const totalErrors = dmPsych.getTotalErrors(data, correctAnswers);
                console.log(totalErrors)
                data.totalErrors = totalErrors;
            },
        };

        const errorMessage = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You provided the wrong answer.<br>To make sure you understand the game, please continue to re-read the instructions.</p>`
                    },
                ],
            ],
            button_label_finish: 'Next',
        };

        const conditionalNode = {
          timeline: [errorMessage],
          conditional_function: () => {
            const fail = jsPsych.data.get().last(1).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const instLoop = {
          timeline: [choiceInstructions, attnChk, conditionalNode],
          loop_function: () => {
            const fail = jsPsych.data.get().last(2).select('totalErrors').sum() > 0 ? true : false;
            return fail;
          },
        };

        const readyToPlay = {
            type: jsPsychSurvey,
            pages: [
                [
                    {
                        type: 'html',
                        prompt: `<p>You're now ready to play Spin the Wheel.</p>
                        <p>Remember: The more tokens you earn, the better your chances of winning a <b>$100.00</b> bonus!</p>`
                    },
                ],

            ],
            button_label_finish: 'Next',
        };

        this.timeline = [practiceComplete, instLoop, readyToPlay];
    };


    function MakePracticeWheel(weight) {

        const speedText1 = (weight == 'heavy') ? "<b>as fast as possible</b>" : "<b>at a moderate pace</b>";
        const speedText2 = (weight == 'heavy') ? "If you do not tap your right arrow as fast as possible, the wheel will not build enough momentum to spin." : "If you tap your right arrow either too quickly or too slowly, the wheel will not build enough momentum to spin.";
        const targetPressTime = (weight == 'heavy') ? [0, .2] : [.2, .75];
        const stimuli = [
            { prompt: `<div class='spin-instructions'>
            <p>This wheel is <b>${weight}</b>. To spin it, repeatedly tap your right arrow ${speedText1} to build momentum.
            Once you build enough momentum, you'll see a "Ready!" message at the center of the wheel,
            which means you can spin the wheel by pressing your spacebar. Once you spin the wheel, you can stop tapping your right arrow.</p>
            <p>Practice spinning by (1) tapping your right arrow ${speedText1} and then (2) pressing your spacebar when the "Ready!" message appears.</p>
            </div>`, sectors: [wedges[3], wedges[3], wedges[8], wedges[8]] },

            { prompt: `<div class='spin-instructions'>
            <p>Great job! Now, spin two more <b>${weight}</b> wheels to get the hang of it. Remember:</p>
            <p>To spin <b>${weight}</b> wheels, (1) tap your right arrow ${speedText1}, then (2) press your spacebar when the "Ready!" message appears.</p>
            <p>Once you spin the wheel, you can stop tapping your right arrow.</p>
            </div>`, sectors: [wedges[2], wedges[4], wedges[7], wedges[9]] },

            { prompt: `<div class='spin-instructions'>
            <p>Great job! Now, spin one more <b>${weight}</b> wheel to get the hang of it. Remember:</p>
            <p>To spin <b>${weight}</b> wheels, (1) tap your right arrow ${speedText1}, then (2) press your spacebar when the "Ready!" message appears.</p>
            <p>Once you spin the wheel, you can stop tapping your right arrow.</p>
            </div>`, sectors: [wedges[7], wedges[7], wedges[7], wedges[1]] }
        ]

        const practiceWheel = {
            type: jsPsychCanvasButtonResponse,
            prompt: jsPsych.timelineVariable('prompt'),
            stimulus: function(c, spinnerData) {
                dmPsych.spinner(c, spinnerData, jsPsych.timelineVariable('sectors'), targetPressTime, [0], 1, scoreTracker_practice);
            },
            nSpins: 1,
            initialScore: function() {
                return scoreTracker_practice
            },
            show_scoreboard: false,
            canvas_size: [500, 500],
            post_trial_gap: 500,
            on_finish: function(data) {
                scoreTracker_practice = data.score
            }
        };

        this.timeline = [practiceWheel];
        this.timeline_variables = stimuli;
    };

    p.consent = {
        type: jsPsychExternalHtml,
        url: "./html/consent.html",
        cont_btn: "advance",
    };

    
   /*
    *
    *   TASK
    *
    */


    const stimuli = [
        { heavy: '01030609', light: '03030310', heavy_mi: 2, light_mi: .81, ev: 4.75, sd: 3.5},
        { heavy: '02040710', light: '04040411', heavy_mi: 2, light_mi: .81, ev: 5.75, sd: 3.5},
        { heavy: '04071012', light: '03101010', heavy_mi: 2, light_mi: .81, ev: 8.25, sd: 3.5},
        { heavy: '05081113', light: '04111111', heavy_mi: 2, light_mi: .81, ev: 9.25, sd: 3.5},
        { heavy: '03030310', light: '01030609', heavy_mi: .81, light_mi: 2, ev: 4.75, sd: 3.5},
        { heavy: '04040411', light: '02040710', heavy_mi: .81, light_mi: 2, ev: 5.75, sd: 3.5},
        { heavy: '03101010', light: '04071012', heavy_mi: .81, light_mi: 2, ev: 8.25, sd: 3.5},
        { heavy: '04111111', light: '05081113', heavy_mi: .81, light_mi: 2, ev: 9.25, sd: 3.5},
        { heavy: '04040412', light: '00080808', heavy_mi: .81, light_mi: .81, ev: 6, sd: 4},
        { heavy: '00080808', light: '04040412', heavy_mi: .81, light_mi: .81, ev: 6, sd: 4},
        { heavy: '05050513', light: '01090909', heavy_mi: .81, light_mi: .81, ev: 7, sd: 4},
        { heavy: '01090909', light: '05050513', heavy_mi: .81, light_mi: .81, ev: 7, sd: 4},
        { heavy: '02040610', light: '01050709', heavy_mi: 2, light_mi: 2, ev: 5.5, sd: 3.42},
        { heavy: '01050709', light: '02040610', heavy_mi: 2, light_mi: 2, ev: 5.5, sd: 3.42},
        { heavy: '03050711', light: '02060810', heavy_mi: 2, light_mi: 2, ev: 6.5, sd: 3.42},
        { heavy: '02060810', light: '03050711', heavy_mi: 2, light_mi: 2, ev: 6.5, sd: 3.42},
    ];

    const choice = {
        type: jsPsychHtmlButtonResponse,
        stimulus: function() {
            const heavyWheel = jsPsych.timelineVariable('heavy');
            const lightWheel = jsPsych.timelineVariable('light');
            const heavyWheel_img = `<img class="spinner-img" src="./img/${heavyWheel}.png">`;
            const lightWheel_img = `<img class="spinner-img" src="./img/${lightWheel}.png">`;
            const left_img = (settings.choices[0] == 'Heavy') ? heavyWheel_img : lightWheel_img;
            const right_img = (settings.choices[1] == 'Heavy') ? heavyWheel_img : lightWheel_img;
            const html = `
            <div class="score-board" style="display: flex; color:black">
                <div class="score-board-title">Total Tokens</div>
                <div class="score-board-score" id="score" >${scoreTracker}</div>
            </div>
            <div>
                <div class="spinner-container"><div class="spinner-title">${settings.choices[0]}</div>${left_img}</div>
                <div class="spinner-container"><div class="spinner-title">${settings.choices[1]}</div>${right_img}</div>
            </div>`;
            return html;
        },
        choices: settings.choices,
        prompt: 'Choose a wheel to spin.',
        data: { heavy: jsPsych.timelineVariable('heavy'), light: jsPsych.timelineVariable('light'), heavy_mi: jsPsych.timelineVariable('heavy_mi'), light_mi: jsPsych.timelineVariable('light_mi'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd') },
        on_finish: function(data) {
            data.time = time;
            data.choice = settings.choices[data.response];
            console.log(settings.choices[data.response]);
        }
    };

    const spin = {
        type: jsPsychCanvasButtonResponse,
        stimulus: function(c, spinnerData) {
            const chosenWheel = (jsPsych.data.getLastTrialData().select('choice').values[0] == 'Heavy') ? jsPsych.timelineVariable('heavy') : jsPsych.timelineVariable('light');
            const targetPressTime = (jsPsych.data.getLastTrialData().select('choice').values[0] == 'Heavy') ? [0, .2] : [.2, .75];
            const chosenSectors = getChosenSectors(chosenWheel);
            return dmPsych.spinner(c, spinnerData, chosenSectors, targetPressTime, 0, settings.nSpins, scoreTracker);
        },
        nSpins: settings.nSpins,
        initialScore: function() {
            return scoreTracker;
        },
        canvas_size: [500, 500],
        show_scoreboard: true,
        data: { heavy: jsPsych.timelineVariable('heavy'), light: jsPsych.timelineVariable('light'), heavy_mi: jsPsych.timelineVariable('heavy_mi'), light_mi: jsPsych.timelineVariable('light_mi'), ev: jsPsych.timelineVariable('ev'), sd: jsPsych.timelineVariable('sd') },
        on_finish: function(data) {
            scoreTracker = data.score;
            data.time = time;
            time++;
        },
    };

   /*
    *
    *   TIMELINES
    *
    */

    p.choice = {
        timeline: [choice, spin],
        timeline_variables: stimuli,
        randomize_order: true,
        repetitions: 2,
    };

    p.heavyPractice = new MakePracticeWheel('heavy');

    p.lightPractice = new MakePracticeWheel('light');

    p.attnChk = new MakeAttnChk();


   /*
    *
    *   DEMOGRAPHICS
    *
    */

    p.demographics = (function() {


        const taskComplete = {
            type: jsPsychInstructions,
            pages: function () { 
                let scoreArray = jsPsych.data.get().select('score').values;
                console.log(scoreArray);
                let totalScore = scoreArray[scoreArray.length - 1];
                return [`<div class='parent' style='color: rgb(109, 112, 114)'>
                    <p>Spin the Wheel is now complete! You won a total of <strong>${totalScore}</strong> tokens!</p>
                    <p>To finish this study, please continue to answer a few final questions.</p>
                    </div>`];
            },  
            show_clickable_nav: true,
            post_trial_gap: 500,
            allow_keys: false,
        };

        const gender = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>What is your gender?</p>',
            choices: ['Male', 'Female', 'Other'],
            on_finish: (data) => {
                data.gender = data.response;
            }
        };

        const age = {
            type: jsPsychSurveyText,
            questions: [
                {
                    prompt: "Age:", 
                    name: "age",
                    required: true,
                }
            ],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 

        const ethnicity = {
            type: jsPsychSurveyHtmlForm,
            preamble: '<p>What is your race / ethnicity?</p>',
            html: `<div style="text-align: left">
            <p>White / Caucasian <input name="ethnicity" type="radio" value="white"/></p>
            <p>Black / African American <input name="ethnicity" type="radio" value="black"/></p>
            <p>East Asian (e.g., Chinese, Korean, Vietnamese, etc.) <input name="ethnicity" type="radio" value="east-asian"/></p>
            <p>South Asian (e.g., Indian, Pakistani, Sri Lankan, etc.) <input name="ethnicity" type="radio" value="south-asian"/></p>
            <p>Latino / Hispanic <input name="ethnicity" type="radio" value="hispanic"/></p>
            <p>Middle Eastern / North African <input name="ethnicity" type="radio" value="middle-eastern"/></p>
            <p>Indigenous / First Nations <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Bi-racial <input name="ethnicity" type="radio" value="indigenous"/></p>
            <p>Other <input name="other" type="text"/></p>
            </div>`,
            on_finish: (data) => {
                data.ethnicity = data.response.ethnicity;
                data.other = data.response.other;
            }
        };

        const english = {
            type: jsPsychHtmlButtonResponse,
            stimulus: '<p>Is English your native language?:</p>',
            choices: ['Yes', 'No'],
            on_finish: (data) => {
                data.english = data.response;
            }
        };  

        const finalWord = {
            type: jsPsychSurveyText,
            questions: [{prompt: "Questions? Comments? Complains? Provide your feedback here!", rows: 10, columns: 100, name: "finalWord"}],
            on_finish: (data) => {
                dmPsych.saveSurveyData(data); 
            },
        }; 


        const demos = {
            timeline: [taskComplete, gender, age, ethnicity, english, finalWord]
        };

        return demos;

    }());


   /*
    *
    *   SAVE DATA
    *
    */

    p.save_data = {
        type: jsPsychPipe,
        action: "save",
        experiment_id: "LQgaatPFN2fM",
        filename: dmPsych.filename,
        data_string: ()=>jsPsych.data.get().csv()
    };

    return p;

}());

const timeline = [exp.consent, exp.howToSpin_heavy, exp.heavyPractice, exp.howToSpin_light, exp.lightPractice, exp.attnChk, exp.choice, exp.demographics, exp.save_data];

jsPsych.run(timeline);
