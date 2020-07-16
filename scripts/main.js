import { StageBuilder } from './stage.js'
import { Color } from './color.js';
import { Code } from './code.js';
import { Overworld } from './overworld.js';
import { Rewards } from './rewards.js';
import playAudio from './jukebox.js';



// animation definition
const animationDefinitionMovementEl = document.querySelector('#animation-definition .stage:nth-child(1)');
const animationDefinitionColorEl = document.querySelector('#animation-definition .stage:nth-child(2)');
const sizeAnimationEl = document.querySelector('#size-animation');
const wrongYAnimationEl = document.querySelector('#wrong-y-animation');
const properYAnimationEl = document.querySelector('#proper-y-animation');

const animatedMovementStage = new StageBuilder(animationDefinitionMovementEl, 332, 50)
    // .attachPlaybackControls({ playAndPause: true, playStep: false })
    .attachObservedValue({ name: 'x', value: 2 })
    .attachObservedValue({ name: 'y', value: 10 })
    .attachBoundInput({ type: 'number', label: 'Posição x', observable: 'x', formatter: { type: 'number', decimals: 0 }, attrs: { disabled: true, min: 0, max: 200, step: 1 }, classes: ['number-input', 'number-input-3'] })
    .attachBoundInput({ type: 'number', label: 'Posição y', observable: 'y', formatter: { type: 'number', decimals: 0 }, attrs: { min: 0, max: 200, step: 1 }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'stroke-rectangle', props: { size: 30, color: 'black' }, bindings: [{ name: 'x', property: 'x' }, { name: 'y', property: 'y' }] })
    .attachAnimation({ loop: true, observable: 'x', start: 2, end: 300, duration: 5000, delayAfter: 2000 })
    .build();

const animatedColorStage = new StageBuilder(animationDefinitionColorEl, 80, 50)
    .attachObservedValue({ name: 'color', value: new Color('#6495ed') })
    .attachBoundInput({ type: 'color', label: 'Cor', observable: 'color', formatter: { type: 'color' }, attrs: { disabled: true }, classes: ['number-input'] })
    .attachActor({ type: 'fill-circle', props: { size: 30, x: 40, y: 25 }, bindings: [{ name: 'color', property: 'color' }] })
    .attachAnimation({ loop: true, observable: 'color', start: new Color('#6495ed'), end: new Color('#daa520'), duration: 5000, delayAfter: 2000 })
    .build();

const sizeAnimationStage = new StageBuilder(sizeAnimationEl, 75, 75)
    .attachObservedValue({ name: 'size', value: 15 })
    .attachBoundInput({ type: 'number', label: 'Raio', observable: 'size', formatter: { type: 'number' }, attrs: { disabled: true }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'stroke-circle', props: { x: 30, y: 30 }, bindings: [{ name: 'size', property: 'size' }] })
    .attachAnimation({ loop: true, observable: 'size', start: 15, end: 45, duration: 5000, delayAfter: 2000 })
    .build();

const controllingTStage = new StageBuilder(document.querySelector('#controlling-t'), 75, 75)
    .attachObservedValue({ name: 'size', value: 15, binding: { name: 't', from: t => 15 + 30 * t, to: t => (t - 15) / 30 } })
    .attachObservedValue({ name: 't', value: 0, alwaysNotify: true })
    .attachBoundInput({ type: 'number', label: 'Raio', observable: 'size', formatter: { type: 'number' }, attrs: { disabled: true }, classes: ['number-input', 'number-input-3'] })
    .attachBoundInput({ type: 'range', label: 't', observable: 't', attrs: { min: 0, max: 1, step: 0.01 }, classes: ['range-input'] })
    .attachBoundInput({ type: 'number', label: '&nbsp;', observable: 't', formatter: { type: 'number', decimals: 2 }, attrs: { disabled: true }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'stroke-circle', props: { x: 30, y: 30 }, bindings: [{ name: 'size', property: 'size' }] })
    // .attachAnimation({ loop: true, observable: 'size', start: 15, end: 45, duration: 5000, delayAfter: 2000 })
    .build();

const wrongYAnimationStage = new StageBuilder(wrongYAnimationEl, 75, 180)
    .attachObservedValue({ name: 'y', value: 140 })
    .attachBoundInput({ type: 'number', label: 'y', observable: 'y', formatter: { type: 'number' }, attrs: { disabled: false }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'fill-rectangle', props: { color: 'goldenrod', x: 22, size: 30 }, bindings: [{ name: 'y', property: 'y' }] })
    .build();

const properYAnimationStage = new StageBuilder(properYAnimationEl, 75, 180)
    .attachObservedValue({ name: 'y', value: 0 })
    .attachBoundInput({ type: 'number', label: 'y', observable: 'y', formatter: { type: 'number' }, attrs: { disabled: false }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'fill-rectangle', props: { color: 'goldenrod', x: 22, size: 30 }, bindings: [{ name: 'y', property: 'y' }] })
    .attachAnimation({ loop: true, observable: 'y', start: 0, end: 140, duration: 5000, delayAfter: 2000 })
    .build();

const refactoredYAnimationStage = new StageBuilder(document.querySelector('#refactored-y-animation'), 75, 180)
    .attachObservedValue({ name: 'y', value: 0 })
    .attachBoundInput({ type: 'number', label: 'y', observable: 'y', formatter: { type: 'number' }, attrs: { disabled: false }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'fill-rectangle', props: { color: 'goldenrod', x: 22, size: 30 }, bindings: [{ name: 'y', property: 'y' }] })
    .attachAnimation({ loop: true, observable: 'y', start: 0, end: 140, duration: 5000, delayAfter: 2000 })
    .build();

const variousAnimationsStage = new StageBuilder(document.querySelector('#various-animations'), 75, 220)
    .attachObservedValue({ name: 'x', value: 0 })
    .attachObservedValue({ name: 'y', value: 0 })
    .attachObservedValue({ name: 'size', value: 0 })
    .attachBoundInput({ type: 'number', label: 'x', observable: 'x', formatter: { type: 'number' }, attrs: { disabled: false }, classes: ['number-input', 'number-input-3'] })
    .attachBoundInput({ type: 'number', label: 'y', observable: 'y', formatter: { type: 'number' }, attrs: { disabled: false }, classes: ['number-input', 'number-input-3'] })
    .attachBoundInput({ type: 'number', label: 'lado', observable: 'size', formatter: { type: 'number' }, attrs: { disabled: false }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'fill-rectangle', props: { color: 'goldenrod' }, bindings: [{ name: 'x', property: 'x' }, { name: 'y', property: 'y' }, { name: 'size', property: 'size' }] })
    .attachAnimation({ loop: true, observable: 'x', start: 30, end: 20, duration: 5000, delayAfter: 2000 })
    .attachAnimation({ loop: true, observable: 'y', start: 0, end: 140, duration: 5000, delayAfter: 2000 })
    .attachAnimation({ loop: true, observable: 'size', start: 30, end: 60, duration: 5000, delayAfter: 2000 })
    .build();

const slimeDrawStage = new StageBuilder(document.querySelector('#slime-draw'), 60, 60)
    .attachActor({ type: 'single-image', props: { src: 'imgs/slime-parado.png', x: 10, y: 10 } })
    .build();

const slimeDrawLargeStage = new StageBuilder(document.querySelector('#slime-draw-large'), 110, 110, true)
    .attachActor({ type: 'single-image', props: { src: 'imgs/slime-parado.png', x: -14, y: -30, width: 128, height: 128 } })
    .build();

const slimeXStage = new StageBuilder(document.querySelector('#slime-x'), 140, 40)
    .attachObservedValue({ name: 'x', value: 0 })
    .attachBoundInput({ type: 'number', label: 'x', observable: 'x', formatter: { type: 'number' }, attrs: { disabled: true }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'single-image', props: { src: 'imgs/slime-parado.png', y: 4 }, bindings: [{ name: 'x', property: 'x' }] })
    .attachAnimation({ loop: true, observable: 'x', start: 0, end: 100, duration: 5000, delayAfter: 2000 })
    .build();

const quizFrameStage = new StageBuilder(document.querySelector('#quiz-frame'), 110, 110, true)
    .attachObservedValue({ name: 'frame', value: 0 })
    .attachBoundInput({ type: 'number', label: 'quadro', observable: 'frame', formatter: { type: 'number' }, attrs: { min: 0, max: 9 }, classes: ['number-input', 'number-input-1'] })
    .attachActor({ type: 'sheet-image', props: { src: 'imgs/slime-atoa-spritesheet-numerado.png', x: 0, y: -30, width: 96, height: 96, frameWidth: 32, frameHeight: 32 }, bindings: [{ name: 'frame', property: 'frameX' }] })
    // .attachAnimation({ loop: true, observable: 'frame', start: 0, end: 9, duration: 1000, delayAfter: 0 })
    .build();

const spritesheetAnimationStage = new StageBuilder(document.querySelector('#spritesheet-animation'), 322, 150, true)
    .attachObservedValue({ name: 'frame', value: 0, alwaysNotify: true })
    .attachObservedValue({ name: 'xFrame', value: 0, binding: { name: 'frame', from: v => Math.floor(v) * 32, to: v => Math.floor(v / 32) } })
    .attachBoundInput({ type: 'number', label: 'quadro', observable: 'frame', formatter: { type: 'number', rounding: 'floor' }, attrs: { min: 0, max: 9 }, classes: ['number-input', 'number-input-1'] })
    .attachBoundInput({ type: 'number', label: 'x do quadro', observable: 'xFrame', formatter: { type: 'number' }, attrs: { min: 0, max: 320, disabled: true }, classes: ['number-input', 'number-input-3'] })
    .attachActor({ type: 'sheet-image', props: { src: 'imgs/slime-atoa-spritesheet-numerado.png', x: 0, y: -30, width: 96, height: 96, frameWidth: 32, frameHeight: 32 }, bindings: [{ name: 'frame', property: 'frameX' }] })
    .attachActor({ type: 'single-image', props: { src: 'imgs/slime-atoa-spritesheet-numerado.png', x: 0, y: 110, width: 320, height: 32 } })
    .attachActor({ type: 'stroke-rectangle', props: { x: 0, y: 110, size: 32, color: 'goldenrod' }, bindings: [{ name: 'xFrame', property: 'x' }] })
    .attachAnimation({ loop: true, observable: 'frame', start: 0, end: 9, duration: 8000, delayAfter: 3000 })
    .build();

const spritesheetAnimationResultStage = new StageBuilder(document.querySelector('#spritesheet-animation-result'), 98, 98, true)
    .attachObservedValue({ name: 'frame', value: 0 })
    .attachActor({ type: 'sheet-image', props: { src: 'imgs/slime-spritesheet.png', x: 0, y: -30, width: 96, height: 96, frameWidth: 32, frameHeight: 32 }, bindings: [{ name: 'frame', property: 'frameX' }] })
    .attachAnimation({ loop: true, observable: 'frame', start: 0, end: 9, duration: 800, delayAfter: 0 })
    .build();

const spritesheetLargeStage = new StageBuilder(document.querySelector('#spritesheet-large'), 130, 130, true)
    .attachObservedValue({ name: 'frame', value: 0 })
    .attachObservedValue({ name: 'yFrame', value: 0 })
    .attachBoundInput({ type: 'number', label: 'linha', observable: 'yFrame', formatter: { type: 'number' }, attrs: { min: 0, max: 4 }, classes: ['number-input', 'number-input-1'] })
    .attachActor({ type: 'sheet-image', props: { src: 'imgs/slime-spritesheet.png', x: 0, y: -30, width: 128, height: 128, frameWidth: 32, frameHeight: 32 }, bindings: [{ name: 'frame', property: 'frameX' }, { name: 'yFrame', property: 'frameY' }] })
    .attachAnimation({ loop: true, observable: 'frame', start: 0, end: 9, duration: 800, delayAfter: 0 })
    .build();


// highlights
const highlighters = document.querySelectorAll('[data-highlight]');
highlighters.forEach(el => {
    el.addEventListener('mouseover', () => document.querySelector(el.dataset.highlight).classList.add('highlighted'));
    el.addEventListener('mouseout', () => document.querySelector(el.dataset.highlight).classList.remove('highlighted'));
})

// code executors
const wrongForYAnimationRunEl = document.querySelector('#wrong-y-animation-run');
const wrongForYAnimationResultEl = document.querySelector('#wrong-y-animation-result');
const wrongForYAnimationCode = new Code(`
    const canvasEl = document.createElement('canvas');
    const ctx = canvasEl.getContext('2d');

    function desenhaQuadrado(x, y) {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(x, y, 30, 30);
    }

    const timeBefore = performance.now();
    for (let y = 0; y <= 140; y++) {
        desenhaQuadrado(10, y);
    }
    const ellapsed = performance.now() - timeBefore;
    
    ellapsed;
`, wrongForYAnimationRunEl, result => {
    wrongForYAnimationResultEl.classList.remove('invisible');
    wrongForYAnimationResultEl.querySelector('.actual-value').innerHTML = result;
});

// code highlighting
hljs.initHighlightingOnLoad();


// modals
document.querySelectorAll('[data-modal]').forEach(el => {
    const modalEl = document.querySelector(el.dataset.modal);
    if (modalEl) {
        el.addEventListener('click', e => {
            e.preventDefault();
            $(modalEl).modal('show');
        })
    }
});
$('#animated-sprite-class-modal .item').tab();

// popups
$('.popup').popup();


// overworld and rewards
const overworld = new Overworld(
    document.querySelector('#overworld'),
    document.querySelector('#overworld-char'),
    document.querySelector('#overworld-map')
);

const rewards = new Rewards(document.querySelectorAll('.treasure'));




// level, rewards and overworld hooks
const clueToLevel2Jiggling = setInterval(() => $('#level-1 .treasure-clue').transition('jiggle'), 8000);
let level1TriggerStarted = false;
$('#level-1').on('change', 'input[type="range"]', e => {
    if (!level1TriggerStarted) {
        clearInterval(clueToLevel2Jiggling);
        level1TriggerStarted = true;
        setTimeout(() => {
            playAudio('whoosh');
            overworld.moveToLevel(1);
            $('#level-2').removeClass('hidden');
            setTimeout(() => {
                $('#implementando-uma-animacao')[0].scrollIntoView({ behavior: "smooth" });

                setTimeout(() => {
                    rewards.unlock(document.querySelector('.treasure[data-prize="#images-modal"]'));
                }, 800);
            }, 200);
        }, 800);
    }
});

let level2CodeExecuted = false;
let level2TriggerStarted = false;
const clueToSublevel2aJiggling = setInterval(() => $('#level-2 #wrong-y-animation-run').transition('jiggle'), 8000);
const clueToSublevel2bJiggling = setInterval(() => $('#level-2 .treasure-clue').transition('jiggle'), 8000);
const clueToLevel3Jiggling = setInterval(() => $('#level-2 #animation-class-treasure-trigger').transition('jiggle'), 5000);
$('#level-2 #wrong-y-animation-run').click(e => {
    if (!level2CodeExecuted) {
        level2CodeExecuted = true;
        clearInterval(clueToSublevel2aJiggling);
        $('.level-2-quiz-sublevel').removeClass('hidden');

        $('#quiz-pretty-fast input[type="radio"]').change(e => {
            const optionInputId = $('#quiz-pretty-fast input[type="radio"]:checked')[0].id;
            $('#quiz-pretty-fast .quiz-result').removeClass('invisible');
            $(`#quiz-pretty-fast .quiz-result [data-response-for`).addClass('hidden');
            $(`#quiz-pretty-fast .quiz-result [data-response-for="#${optionInputId}"]`).removeClass('hidden');

            const rightAnswerId = 'quiz-pretty-fast-option-yes';
            if (optionInputId === rightAnswerId) {
                clearInterval(clueToSublevel2bJiggling);
                $('.level-2-after-quiz-sublevel').removeClass('hidden');
                playAudio('kids');
            } else {
                playAudio('ding');
                $('#quiz-pretty-fast input[type="radio"]:checked').transition('shake');
            }
        });

        $('#animation-class-treasure-trigger').one('click', e => {
            if (!level2TriggerStarted) {
                clearInterval(clueToLevel3Jiggling);
                level2TriggerStarted = true;
                playAudio('whoosh');
                setTimeout(() => {
                    overworld.moveToLevel(2);
                    $('#level-3').removeClass('hidden');
                    setTimeout(() => {
                        $('#usando-imagens-sprites')[0].scrollIntoView({ behavior: 'smooth' });

                        setTimeout(() => {
                            rewards.unlock(document.querySelector('.treasure[data-prize="#animation-class-modal"]'));
                        }, 800);
                    }, 800);
                }, 200);
            }
        });
    }
});


let level3TriggerStarted = false;
const clueToLevel4Jiggling = setInterval(() => $('#level-3 .treasure-clue').transition('jiggle'), 8000);
$('#quiz-sprite input[type="radio"]').change(e => {
    const optionInputId = $('#quiz-sprite input[type="radio"]:checked')[0].id;
    $('#quiz-sprite .quiz-result').removeClass('invisible');
    $(`#quiz-sprite .quiz-result [data-response-for`).addClass('hidden');
    $(`#quiz-sprite .quiz-result [data-response-for="#${optionInputId}"]`).removeClass('hidden');

    const rightAnswerId = 'quiz-sprite-option-image';
    if (optionInputId === rightAnswerId) {
        clearInterval(clueToLevel4Jiggling);
        playAudio('kids');

        if (!level3TriggerStarted) {
            level3TriggerStarted = true;
            setTimeout(() => {
                overworld.moveToLevel(3);
                $('#level-4').removeClass('hidden');
                setTimeout(() => {
                    $('#animacao-com-spritesheets')[0].scrollIntoView({ behavior: 'smooth' });

                    setTimeout(() => {
                        rewards.unlock(document.querySelector('.treasure[data-prize="#sprite-class-modal"]'));
                    }, 800);
                }, 800);
            }, 200);
        }
    } else {
        playAudio('ding');
        $('#quiz-sprite input[type="radio"]:checked').transition('shake');
    }
});


let level4TriggerStarted = false;
let level4InputChanged = 0;
const clueToLevel5Jiggling = setInterval(() => $('#level-4 .treasure-clue').transition('jiggle'), 8000);
$('#spritesheet-large input').on('input', () => {
    level4InputChanged++;
    playAudio('whoosh');
    if (level4InputChanged >= 4 && !level4TriggerStarted) {
        level4TriggerStarted = true;
        playAudio('kids');
        clearInterval(clueToLevel5Jiggling);
        
        setTimeout(() => {
            overworld.finishGame();
            setTimeout(() => {
                $('#end-modal')
                    .modal({
                        onHidden: () => {
                            setTimeout(() => {
                                rewards.unlock(document.querySelector('.treasure[data-prize="#animated-sprite-class-modal"]'));
                            }, 800);
                        }
                    })
                    .modal('setting', 'closable', false)
                    .modal('show');
            }, 800);
        }, 200);
    }
});


// deep links
const hashes = ['#o-que-e-animacao', '#implementando-uma-animacao', '#usando-imagens-sprites', '#animacao-com-spritesheets'];
if (hashes.indexOf(document.location.hash) !== -1) {
    for (let level = 1; level <= hashes.indexOf(document.location.hash) + 1; level++) {
        $(`#level-${level}`).removeClass('hidden');
        $(`#level-${level} .sublevel.hidden`).removeClass('hidden');
    }
}