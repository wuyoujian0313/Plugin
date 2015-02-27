//
//  MenuCollectionViewCell.m
//  PluginApp
//
//  Created by wuyj on 15-1-6.
//  Copyright (c) 2015年 baidu. All rights reserved.
//

#import "MenuCollectionViewCell.h"
#import "SDImageCache.h"
#import "UIImageView+WebCache.h"
#import "LineView.h"

@interface MenuCollectionViewCell ()
@property(nonatomic,copy) NSString              *imageUrl;
@property(nonatomic,strong) LineView            *lineH;
@property(nonatomic,strong) LineView            *lineV;


@end


@implementation MenuCollectionViewCell

-(void)longPress:(UILongPressGestureRecognizer *)sender {
    
    if (_delegate != nil && [_delegate respondsToSelector:@selector(longPress:indexPath:)]) {
        [_delegate longPress:self indexPath:_indexPath];
    }
}

-(void)delAction:(UIButton *)sender {
    if (_delegate != nil && [_delegate respondsToSelector:@selector(delItem:indexPath:)]) {
        [_delegate delItem:self indexPath:_indexPath];
    }
}

- (id)initWithFrame:(CGRect)frame {
    self = [super initWithFrame:frame];
    if (self) {
        // Initialization code
        self.contentView.backgroundColor = [UIColor clearColor];
        
        
        UILongPressGestureRecognizer *longPress = [[UILongPressGestureRecognizer alloc] initWithTarget:self action:@selector(longPress:)];
        [self.contentView addGestureRecognizer:longPress];
        
        
        self.menuImageView = [[UIImageView alloc] initWithFrame:CGRectMake((self.frame.size.width - 35)/2.0, 26, 35, 35)];
        _menuImageView.backgroundColor = [UIColor whiteColor];
        _menuImageView.userInteractionEnabled = YES;
        [_menuImageView setContentMode:UIViewContentModeScaleAspectFit];
        [self.contentView addSubview:_menuImageView];
        
        
        self.nameLabel = [[UILabel alloc] initWithFrame:CGRectMake(0,26 + 35 + 16, self.frame.size.width, 18)];
        [_nameLabel setBackgroundColor:[UIColor clearColor]];
        [_nameLabel setTextAlignment:NSTextAlignmentCenter];
        [_nameLabel setLineBreakMode:NSLineBreakByTruncatingTail];
        [_nameLabel setFont:[UIFont systemFontOfSize:16]];
        [_nameLabel setTextColor:[UIColor colorWithHex:0x353e4a]];
        [self.contentView addSubview:_nameLabel];
        
        self.progressView = [[UIProgressView alloc] initWithProgressViewStyle:UIProgressViewStyleDefault];
        [_progressView setFrame:CGRectMake(5, self.frame.size.height - 10, self.frame.size.width - 10, 10)];
        _progressView.hidden = YES;
        [self.contentView addSubview:_progressView];
        
        self.lineH = [[LineView alloc] initWithFrame:CGRectMake(0, self.bounds.size.height - kLineHeight1px, self.bounds.size.width, kLineHeight1px)];
        [self.contentView addSubview:_lineH];
        
        self.lineV = [[LineView alloc] initWithFrame:CGRectMake(self.bounds.size.width - kLineHeight1px, 0, kLineHeight1px, self.bounds.size.height)];
        _lineV.isVertical = YES;
        [self.contentView addSubview:_lineV];
        
        self.delBtn = [[UIButton alloc] initWithFrame:CGRectMake(84, 10, 30, 30)];
        [_delBtn setBackgroundImage:[UIImage imageNamed:@"delete.png"] forState:UIControlStateNormal];
        [_delBtn addTarget:self action:@selector(delAction:) forControlEvents:UIControlEventTouchUpInside];
        [self.contentView addSubview:_delBtn];
        _delBtn.hidden = YES;
        
        
    }
    return self;
}

-(void)setImageUrl:(NSString *)imageUrl withName:(NSString*)name {

    if (name == nil) {
        _nameLabel.text = @"";
        _menuImageView.image = [UIImage imageNamed:@"add"];
        _menuImageView.frame = CGRectMake((self.frame.size.width - 40)/2.0, (self.frame.size.height - 35)/2.0, 35, 35);
        return;
    }
    
    _menuImageView.frame = CGRectMake((self.frame.size.width - 35)/2.0, 26, 35, 35);
    
    [self setImageUrl:imageUrl];
    _nameLabel.text = name;
    
    //取图片缓存
    SDImageCache * imageCache = [SDImageCache sharedImageCache];
    
    //从缓存取
    UIImage *default_image = [imageCache imageFromDiskCacheForKey:imageUrl];
    
    if (default_image == nil) {
        default_image = [UIImage imageNamed:@"add"];
        
        [_menuImageView sd_setImageWithURL:[NSURL URLWithString:imageUrl]
                          placeholderImage:default_image
                                 completed:^(UIImage *image, NSError *error, SDImageCacheType cacheType, NSURL *imageURL) {
                                     if (image) {
                                         _menuImageView.image = image;
                                         [[SDImageCache sharedImageCache] storeImage:image forKey:imageUrl];
                                     }
                                     
                                 }
         ];
    } else {
        _menuImageView.image = default_image;
    }
    
}



@end
