// Hangman drawing functionality
export function drawHangman(lives, canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;

    // Base
    drawPart(ctx, () => {
        ctx.moveTo(20, 180);
        ctx.lineTo(180, 180);
    });

    if (lives <= 9) drawVerticalPost(ctx);
    if (lives <= 8) drawHorizontalBeam(ctx);
    if (lives <= 7) drawRope(ctx);
    if (lives <= 6) drawHead(ctx);
    if (lives <= 5) drawBody(ctx);
    if (lives <= 4) drawLeftArm(ctx);
    if (lives <= 3) drawRightArm(ctx);
    if (lives <= 2) drawLeftLeg(ctx);
    if (lives <= 1) drawRightLeg(ctx);
}

function drawPart(ctx, drawFn) {
    ctx.beginPath();
    drawFn();
    ctx.stroke();
}

function drawVerticalPost(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(60, 180);
        ctx.lineTo(60, 20);
    });
}

function drawHorizontalBeam(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(60, 20);
        ctx.lineTo(140, 20);
    });
}

function drawRope(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(140, 20);
        ctx.lineTo(140, 40);
    });
}

function drawHead(ctx) {
    drawPart(ctx, () => {
        ctx.arc(140, 55, 15, 0, Math.PI * 2);
    });
}

function drawBody(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(140, 70);
        ctx.lineTo(140, 120);
    });
}

function drawLeftArm(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(140, 80);
        ctx.lineTo(120, 100);
    });
}

function drawRightArm(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(140, 80);
        ctx.lineTo(160, 100);
    });
}

function drawLeftLeg(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(140, 120);
        ctx.lineTo(120, 150);
    });
}

function drawRightLeg(ctx) {
    drawPart(ctx, () => {
        ctx.moveTo(140, 120);
        ctx.lineTo(160, 150);
    });
}