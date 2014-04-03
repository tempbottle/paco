/* Copyright 2013 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#import "PacoDayOfMonthSelectionView.h"

#import "PacoColor.h"

@implementation PacoDayOfMonthSelectionView


- (id)initWithStyle:(UITableViewCellStyle)style reuseIdentifier:(NSString *)reuseIdentifier {
  self = [super initWithStyle:style reuseIdentifier:reuseIdentifier];
  if (self) {
    self.selectionStyle = UITableViewCellSelectionStyleNone;
    self.minValue = 1;
    self.maxValue = 30;
    self.value = @1;
    self.format = NSLocalizedString(@"Day of Month", nil);
  }
  return self;
}

- (void)layoutSubviews {
  [super layoutSubviews];
  self.backgroundColor = [PacoColor pacoBackgroundWhite];
}

@end
