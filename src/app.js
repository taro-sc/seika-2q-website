import { createScope, animate, utils, stagger, createTimeline } from 'animejs';

createScope({
  mediaQueries: {
    isSmall: '(max-width: 100px)',
    isMedium: '(min-width: 101px) and (max-width: 200px)',
    isLarge: '(min-width: 201px)',
    reduceMotion: '(prefers-reduced-motion)',
  },
}).add((self) => {
  const { isSmall, isMedium, isLarge, reduceMotion } = self.matches;

  utils.set('.square', { scale: isMedium ? 0.75 : isLarge ? 1 : 0.5 });

  animate('.square', {
    x: isSmall ? 0 : ['-35vw', '35vw'],
    y: isSmall ? ['-40vh', '40vh'] : 0,
    rotate: 360,
    loop: true,
    alternate: true,
    duration: reduceMotion ? 0 : isSmall ? 750 : 1250,
  });
});

const [$button1, $button2] = utils.$('.revert');

function onMouseEnter() {
  animate(this, { scale: 2, duration: 250 });
}
function onMouseLeave() {
  animate(this, { scale: 1, duration: 750 });
}

const scopeConstructor = (scope) => {
  const circles = utils.$('.circle');

  circles.forEach(($circle, i) => {
    animate($circle, {
      opacity: 0.25,
      loop: true,
      alternate: true,
      duration: 500,
      delay: i * 100,
      ease: 'inOut(3)',
    });
    $circle.addEventListener('mouseenter', onMouseEnter);
    $circle.addEventListener('mouseleave', onMouseLeave);
  });

  // Cleanup function to take care of removing event listeners on revert
  return () => {
    circles.forEach(($circle) => {
      // Anime.js instances are automatically reverted by the Scope
      $circle.removeEventListener('mouseenter', onMouseEnter);
      $circle.removeEventListener('mouseleave', onMouseLeave);
    });
  };
};

const scope1 = createScope({ root: '.row-1' }).add(scopeConstructor);
const scope2 = createScope({ root: '.row-2' }).add(scopeConstructor);

const revertScope1 = () => scope1.revert();
const revertScope2 = () => scope2.revert();

$button1.addEventListener('click', revertScope1);
$button2.addEventListener('click', revertScope2);
